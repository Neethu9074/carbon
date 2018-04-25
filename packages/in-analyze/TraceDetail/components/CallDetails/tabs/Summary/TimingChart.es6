import React, { Fragment } from 'react';

import { hasOnlyExitSpan } from 'in-analyze/TraceDetail/shared/CallHelper.es6';
import {
  NETWORK_TIME_COLOR,
  NETWORK_TIME_LABEL,
  SELF_TIME_COLOR,
  SELF_TIME_LABEL,
  WAITING_TIME_LABEL,
  WAITING_TIME_COLOR,
  NETWORK_TIME_COLOR_OPACITY
} from 'in-analyze/TraceDetail/components/TimingConstants.es6';
import { millis } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import locals from './TimingChart.mless';

const tooltipAlignment = 'topMiddle';

export default function TimingChart({ call, callTreeNode, getColor }) {
  const { start, duration, spans, networkTime } = call;
  const end = start + duration;
  let globalProcessingStart = start;
  let globalProcessingEnd = end;

  if (!duration || hasOnlyExitSpan(call)) {
    return null;
  }

  const scale = createScale();
  scale.setDomainFrom(start);
  scale.setDomainTo(end);
  scale.setRangeFrom(0);
  scale.setRangeTo(100);
  scale.setClamp(true);

  if (networkTime && spans.length === 2) {
    const entrySpan = spans[0].kind == 'ENTRY' ? spans[0] : spans[1];
    globalProcessingStart = entrySpan.start;
    globalProcessingEnd = entrySpan.start + entrySpan.duration;
  }

  const netWorkTimeColor = getColor ? getColor(callTreeNode) : NETWORK_TIME_COLOR;
  const selfTimeColor = getColor ? getColor(callTreeNode) : SELF_TIME_COLOR;

  const networkTimeBlocks = networkTime ? (
    <Fragment>
      {globalProcessingStart - start > 0 ? (
        <TimeBlock
          key="networkBlock_1"
          scale={scale}
          start={start}
          end={globalProcessingStart}
          label={NETWORK_TIME_LABEL}
          color={netWorkTimeColor}
          opacity={NETWORK_TIME_COLOR_OPACITY}
        />
      ) : null}
      {end - globalProcessingEnd > 0 ? (
        <TimeBlock
          key="networkBlock_2"
          scale={scale}
          start={globalProcessingEnd}
          end={end}
          label={NETWORK_TIME_LABEL}
          color={netWorkTimeColor}
          opacity={NETWORK_TIME_COLOR_OPACITY}
        />
      ) : null}
    </Fragment>
  ) : null;

  const timeRanges = mergeChildCallNodesToTimeRanges(callTreeNode.children, globalProcessingStart, globalProcessingEnd);

  const waitingTimeBlocks = timeRanges.map((timeRange, index) => {
    return (
      <TimeBlock
        key={`callBlock_${index}`}
        scale={scale}
        start={timeRange[0]}
        end={timeRange[1]}
        label={WAITING_TIME_LABEL}
        color={WAITING_TIME_COLOR}
        isCallBlock
      />
    );
  });

  let selfTimeBlocks = [];
  let nextSelfTimeBlockStart = globalProcessingStart;
  timeRanges.forEach((timeRange, index) => {
    // ignore 0ms self time block
    if (timeRange[0] > nextSelfTimeBlockStart) {
      selfTimeBlocks.push(
        <TimeBlock
          key={`processingBlock_${index}`}
          scale={scale}
          start={nextSelfTimeBlockStart}
          end={timeRange[0]}
          label={SELF_TIME_LABEL}
          color={selfTimeColor}
        />
      );
    }
    nextSelfTimeBlockStart = timeRange[1];
  });
  // last self time block after last call block
  if (nextSelfTimeBlockStart < globalProcessingEnd) {
    selfTimeBlocks.push(
      <TimeBlock
        key={`processingBlock_${timeRanges.length}`}
        scale={scale}
        start={nextSelfTimeBlockStart}
        end={globalProcessingEnd}
        label={SELF_TIME_LABEL}
        color={selfTimeColor}
      />
    );
  }

  return (
    <div className={locals.timingChart}>
      {networkTimeBlocks}
      {selfTimeBlocks}
      {waitingTimeBlocks}
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
