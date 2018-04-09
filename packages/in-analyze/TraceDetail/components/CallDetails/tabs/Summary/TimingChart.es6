import React, { Fragment } from 'react';
import createScale from 'in-charts/scale';

import locals from './TimingChart.mless';

const NETWORK_BLOCK_COLOR = '#C6EAFF';
const PROCESSING_BLOCK_COLOR = '#a2cafb';
const CALL_BLOCK_COLOR = '#f4d776';

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

  const networkBlocks = networkTime ? (
    <Fragment>
      <TimeBlock
        scale={scale}
        start={start}
        end={start + networkTime / 2}
        label="Network"
        color={NETWORK_BLOCK_COLOR}
      />
      <TimeBlock scale={scale} start={end - networkTime / 2} end={end} label="Network" color={NETWORK_BLOCK_COLOR} />
    </Fragment>
  ) : null;

  const callBlocks = callTreeNode.children.map(childCall => {
    const { start, duration } = childCall;
    return <TimeBlock scale={scale} start={start} end={start + duration} color={CALL_BLOCK_COLOR} />;
  });

  let processingBlocks = [];
  let nextProcessingBlockStart = start + networkTime / 2;
  callTreeNode.children.forEach((childCall, index) => {
    const { start, duration } = childCall;
    if (start != nextProcessingBlockStart) {
      // ignore 0ms processing block
      processingBlocks.push(
        <TimeBlock
          scale={scale}
          start={nextProcessingBlockStart}
          end={start}
          key={`processingBlock${index}`}
          label="Processing"
          color={PROCESSING_BLOCK_COLOR}
        />
      );
    }
    nextProcessingBlockStart = start + duration;
  });
  if (nextProcessingBlockStart != end - networkTime / 2) {
    // ignore 0ms processing block
    processingBlocks.push(
      <TimeBlock
        scale={scale}
        start={nextProcessingBlockStart}
        end={end - networkTime / 2}
        label="Processing"
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
