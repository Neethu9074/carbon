import React, { Fragment } from 'react';
import createScale from 'in-charts/scale';

import locals from './TimingChart.mless';

const NETWORK_BLOCK_COLOR = '#00BBFF';
const PROCESSING_BLOCK_COLOR = '#1A4FFF';
const CALL_BLOCK_COLOR = '#f4d776';

const NETWORK_BLOCK_LABEL = 'Network';
const PROCESSING_BLOCK_LABEL = 'Self';

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

  const callBlocks = callTreeNode.children.map((childCall, index) => {
    return (
      <TimeBlock
        key={`callBlock_${index}`}
        scale={scale}
        start={childCall.start}
        end={childCall.start + childCall.duration}
        color={CALL_BLOCK_COLOR}
      />
    );
  });

  let processingBlocks = [];
  let nextProcessingBlockStart = globalProcessingStart;
  callTreeNode.children.forEach((childCall, index) => {
    // ignore 0ms processing block
    if (childCall.start > nextProcessingBlockStart) {
      processingBlocks.push(
        <TimeBlock
          key={`processingBlock_${index}`}
          scale={scale}
          start={nextProcessingBlockStart}
          end={childCall.start}
          label={PROCESSING_BLOCK_LABEL}
          color={PROCESSING_BLOCK_COLOR}
        />
      );
    }
    nextProcessingBlockStart = childCall.start + childCall.duration;
  });
  // last processing block after last call block
  if (nextProcessingBlockStart < globalProcessingEnd) {
    processingBlocks.push(
      <TimeBlock
        key={`processingBlock_${callTreeNode.children.length}`}
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

  return (
    <div
      className={locals.blockWrapper}
      style={{
        left: `${left}%`,
        width: `${width}%`
      }}
    >
      <div className={locals.timeLabel}>{end - start}ms</div>
      {label ? (
        <div className={locals.timeBlock} style={{ background: color }}>
          <span className={locals.timeBlockLabel}>{label}</span>
        </div>
      ) : (
        <Fragment>
          <div className={locals.timeBlock} style={{ background: 'white' }} />
          <div className={locals.callBlock} style={{ background: color }} />
        </Fragment>
      )}
    </div>
  );
}
