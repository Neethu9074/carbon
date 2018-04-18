import React, { Fragment } from 'react';

import { hasOnlyExitSpan } from 'in-analyze/TraceDetail/shared/CallHelper.es6';
import {
  NETWORK_TIME_COLOR,
  NETWORK_TIME_LABEL,
  PROCESSING_TIME_COLOR,
  PROCESSING_TIME_LABEL,
  CALL_TIME_LABEL,
  CALL_TIME_COLOR,
  NETWORK_TIME_COLOR_OPACITY
} from 'in-analyze/TraceDetail/components/TimingConstants.es6';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import locals from './TimingChart.mless';

const tooltipAlignment = 'topMiddle';

export default function TimingChart({ call, callTreeNode, getColor }) {
  const { start, duration, networkTime } = call;
  const end = start + duration;

  if (!duration || hasOnlyExitSpan(call)) {
    return null;
  }

  const scale = createScale();
  scale.setDomainFrom(start);
  scale.setDomainTo(end);
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setClamp(true);

  const globalProcessingStart = start + (networkTime / 2 || 0);
  const globalProcessingEnd = end - (networkTime / 2 || 0);

  const netWorkTimeColor = getColor ? getColor(callTreeNode) : NETWORK_TIME_COLOR;
  const processingTimeColor = getColor ? getColor(callTreeNode) : PROCESSING_TIME_COLOR;

  const networkBlocks = networkTime ? (
    <Fragment>
      <TimeBlock
        key="networkBlock_1"
        scale={scale}
        start={start}
        end={globalProcessingStart}
        label={NETWORK_TIME_LABEL}
        color={netWorkTimeColor}
        opacity={NETWORK_TIME_COLOR_OPACITY}
      />
      <TimeBlock
        key="networkBlock_2"
        scale={scale}
        start={globalProcessingEnd}
        end={end}
        label={NETWORK_TIME_LABEL}
        color={netWorkTimeColor}
        opacity={NETWORK_TIME_COLOR_OPACITY}
      />
    </Fragment>
  ) : null;

  const timeRanges = mergeChildCallNodesToTimeRanges(callTreeNode.children, globalProcessingStart, globalProcessingEnd);

  const callBlocks = timeRanges.map((timeRange, index) => {
    return (
      <TimeBlock
        key={`callBlock_${index}`}
        scale={scale}
        start={timeRange[0]}
        end={timeRange[1]}
        label={CALL_TIME_LABEL}
        color={CALL_TIME_COLOR}
        isCallBlock
      />
    );
  });

  let processingBlocks = [];
  let nextProcessingBlockStart = globalProcessingStart;
  timeRanges.forEach((timeRange, index) => {
    // ignore 0ms processing block
    if (timeRange[0] > nextProcessingBlockStart) {
      processingBlocks.push(
        <TimeBlock
          key={`processingBlock_${index}`}
          scale={scale}
          start={nextProcessingBlockStart}
          end={timeRange[0]}
          label={PROCESSING_TIME_LABEL}
          color={processingTimeColor}
        />
      );
    }
    nextProcessingBlockStart = timeRange[1];
  });
  // last processing block after last call block
  if (nextProcessingBlockStart < globalProcessingEnd) {
    processingBlocks.push(
      <TimeBlock
        key={`processingBlock_${timeRanges.length}`}
        scale={scale}
        start={nextProcessingBlockStart}
        end={globalProcessingEnd}
        label={PROCESSING_TIME_LABEL}
        color={processingTimeColor}
      />
    );
  }

  return (
    <div className={locals.timingChart}>
      {networkBlocks}
      {processingBlocks}
      {callBlocks}
    </div>
  );
}

function TimeBlock({ scale, start, end, label, color, opacity = 1, isCallBlock }) {
  const left = scale.getRange(start);
  const width = scale.getRange(end) - left;
  const duration = `${millis.fixedCompact(end - start)}`;

  return (
    <div
      className={locals.blockWrapper}
      style={{
        left: `${left}%`,
        width: `${width}%`
      }}
    >
      <div className={locals.timeLabel}>{duration}</div>
      {isCallBlock ? (
        <ChildCallFrame label={label} color={color} duration={duration} />
      ) : (
        <GenericTimeFrame label={label} color={color} duration={duration} opacity={opacity} />
      )}
    </div>
  );
}

function GenericTimeFrame({ label, duration, color, opacity }) {
  return (
    <Tooltip align={tooltipAlignment} content={<FrameTooltipContent label={label} duration={duration} />}>
      <div className={locals.timeBlock} style={{ background: color, opacity }}>
        <span className={locals.timeBlockLabel}>{label}</span>
      </div>
    </Tooltip>
  );
}

function ChildCallFrame({ label, color, duration }) {
  return (
    <Fragment>
      <div className={locals.timeBlock} style={{ background: 'white' }} />
      <Tooltip align={tooltipAlignment} content={<FrameTooltipContent label={label} duration={duration} />}>
        <div className={locals.callBlock} style={{ background: color }} />
      </Tooltip>
    </Fragment>
  );
}

function FrameTooltipContent({ label, duration }) {
  return (
    <div className={locals.tooltip}>
      <span>{label}</span>
      <span>{duration}</span>
    </div>
  );
}

// when there are async child calls that overlap between each other,
// merge them to a single time range
// ex: callA lasts from 100 to 120 and callB lasts from 110 to 130,
// the method should return a time range [100, 130]
function mergeChildCallNodesToTimeRanges(callNodes, globalProcessingStart, globalProcessingEnd) {
  let timeRanges = [];
  let previousTimeRange;

  callNodes
    .map(callNode => {
      const callTimeRange = [callNode.start, callNode.start + callNode.duration];
      return correctChildCallTimeRange(callTimeRange, globalProcessingStart, globalProcessingEnd);
    })
    .sort((timeRange1, timeRange2) => timeRange1[0] - timeRange2[0])
    .forEach(timeRange => {
      if (!previousTimeRange || timeRange[0] > previousTimeRange[1]) {
        // no overlapping with previous  call
        timeRanges.push(timeRange);
        previousTimeRange = timeRange;
      } else if (timeRange[1] > previousTimeRange[1]) {
        // overlaps and ends later than previous call, update the previous call range
        previousTimeRange[1] = timeRange[1];
      }
    });

  return timeRanges;
}

// some child calls may be out of the parent call's processing time range (excluding network time)
// this method allows to correct these imprecisions of tracing
// by moving the child call's time range within the parent call's processing time range
function correctChildCallTimeRange(childCallTimeRange, globalProcessingStart, globalProcessingEnd) {
  const duration = childCallTimeRange[1] - childCallTimeRange[0];

  if (childCallTimeRange[0] < globalProcessingStart) {
    // child call that starts before the parent call's processing start time
    // move it to the beginning of the parent's processing time range
    const start = globalProcessingStart;
    const end = start + duration;
    return [start, end];
  } else if (childCallTimeRange[1] > globalProcessingEnd) {
    // child call that starts after the parent call's processing end time
    // move it to the end of the parent's processing time range
    const end = globalProcessingEnd;
    const start = end - duration;
    return [start, end];
  } else {
    return childCallTimeRange;
  }
}
