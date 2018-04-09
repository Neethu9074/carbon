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
      <DurationBlock
        label="Network"
        color={NETWORK_BLOCK_COLOR}
        scale={scale}
        start={start}
        end={start + networkTime / 2}
      />
      <DurationBlock
        label="Network"
        color={NETWORK_BLOCK_COLOR}
        scale={scale}
        start={end - networkTime / 2}
        end={end}
      />
    </Fragment>
  ) : null;

  const callBlocks = callTreeNode.children.map(childCall => {
    const { start, duration } = childCall;
    return <CallBlock color={CALL_BLOCK_COLOR} scale={scale} start={start} end={start + duration} />;
  });

  let processingBlocks = [];
  let nextProcessingBlockStart = start + networkTime / 2;
  callTreeNode.children.forEach((childCall, index) => {
    const { start, duration } = childCall;
    if (start != nextProcessingBlockStart) {
      processingBlocks.push(
        <DurationBlock
          key={`processingBlock${index}`}
          label="Processing"
          color={PROCESSING_BLOCK_COLOR}
          scale={scale}
          start={nextProcessingBlockStart}
          end={start}
        />
      );
    }
    nextProcessingBlockStart = start + duration;
  });
  processingBlocks.push(
    <DurationBlock
      label="Processing"
      color={PROCESSING_BLOCK_COLOR}
      scale={scale}
      start={nextProcessingBlockStart}
      end={end - networkTime / 2}
    />
  );

  return (
    <div className={locals.timingChart}>
      {networkBlocks}
      {processingBlocks}
      {callBlocks}
    </div>
  );
}

function DurationBlock({ label, color, scale, start, end }) {
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
      <div className={locals.durationBlock} style={{ background: color }}>
        <span className={locals.durationBlockLabel}>{label}</span>
      </div>
    </div>
  );
}

function CallBlock({ color, scale, start, end }) {
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
      <div className={locals.durationBlock} style={{ background: 'white' }} />
      <div className={locals.callBlock} style={{ background: color }} />
    </div>
  );
}
