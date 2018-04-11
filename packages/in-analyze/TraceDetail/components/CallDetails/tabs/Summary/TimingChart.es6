import React, { Fragment } from 'react';
import createScale from 'in-charts/scale';
import Tooltip from 'in-components/Tooltip';

import locals from './TimingChart.mless';

const NETWORK_BLOCK_COLOR = '#00BBFF';
const PROCESSING_BLOCK_COLOR = '#1A4FFF';
const CALL_BLOCK_COLOR = '#f4d776';

const NETWORK_BLOCK_LABEL = 'Network';
const PROCESSING_BLOCK_LABEL = 'Self';

const tooltipAlignment = 'topMiddle';

export default function TimingChart({ call, callTreeNode }) {
  const { start, duration, networkTime } = call;
  const end = start + duration;

  if (!duration) {
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

  const networkBlocks = networkTime ? (
    <Fragment>
      <TimeBlock
        key="networkBlock_1"
        scale={scale}
        start={start}
        end={globalProcessingStart}
        label={NETWORK_BLOCK_LABEL}
        color={NETWORK_BLOCK_COLOR}
      />
      <TimeBlock
        key="networkBlock_2"
        scale={scale}
        start={globalProcessingEnd}
        end={end}
        label={NETWORK_BLOCK_LABEL}
        color={NETWORK_BLOCK_COLOR}
      />
    </Fragment>
  ) : null;

  const timeRanges = mergeCallNodesToTimeRanges(callTreeNode.children);

  const callBlocks = timeRanges.map((timeRange, index) => {
    return (
      <TimeBlock
        key={`callBlock_${index}`}
        scale={scale}
        start={timeRange[0]}
        end={timeRange[1]}
        color={CALL_BLOCK_COLOR}
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
          label={PROCESSING_BLOCK_LABEL}
          color={PROCESSING_BLOCK_COLOR}
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
        label={PROCESSING_BLOCK_LABEL}
        color={PROCESSING_BLOCK_COLOR}
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

function TimeBlock({ scale, start, end, label, color }) {
  const left = scale.getRange(start);
  const width = scale.getRange(end) - left;
  const duration = `${end - start}ms`;

  return (
    <div
      className={locals.blockWrapper}
      style={{
        left: `${left}%`,
        width: `${width}%`
      }}
    >
      <div className={locals.timeLabel}>{duration}</div>
      {label ? (
        <GenericFrame label={label} color={color} duration={duration} />
      ) : (
        <CallFrame color={color} duration={duration} />
      )}
    </div>
  );
}

function GenericFrame({ label, color, duration }) {
  const tooltipContent = `${label}: ${duration}`;
  return (
    <Tooltip content={tooltipContent} align={tooltipAlignment}>
      <div className={locals.timeBlock} style={{ background: color }}>
        <span className={locals.timeBlockLabel}>{label}</span>
      </div>
    </Tooltip>
  );
}

function CallFrame({ color, duration }) {
  const tooltipContent = `Waiting: ${duration}`;
  return (
    <Fragment>
      <div className={locals.timeBlock} style={{ background: 'white' }} />
      <Tooltip content={tooltipContent} align={tooltipAlignment}>
        <div className={locals.callBlock} style={{ background: color }} />
      </Tooltip>
    </Fragment>
  );
}
// when there are async child calls that overlap between each other,
// merge them to a single time range
// ex: callA lasts from 100 to 120 and callB lasts from 110 to 130,
// the method should return a time range [100, 130]
function mergeCallNodesToTimeRanges(callNodes) {
  let timeRanges = [];
  let previousTimeRange;

  callNodes
    .map(callNode => {
      const callTimeRange = [callNode.start, callNode.start + callNode.duration];
      return callTimeRange;
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
