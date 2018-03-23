import React from 'react';

import createScale from 'in-charts/scale';
import { applyLayout } from 'in-new-components/IcicleChart/IcicleLayout';

import locals from './IcicleChart.mless';

export default function IcicleChart({ rootSpan }) {
  const xScale = createScale();
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  const spanFrames = applyLayout(rootSpan);

  return (
    <div className={locals.chart}>
      <div className={locals.frameWrapper}>
        {spanFrames.map(spanFrame => <SpanFrame key={spanFrame.id} spanFrame={spanFrame} xScale={xScale} />)}
      </div>
    </div>
  );
}

const frameHeight = 20;

function SpanFrame({ spanFrame, xScale }) {
  const { label, depth, x, dx } = spanFrame;

  const top = frameHeight * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(dx);

  return (
    <div
      className={locals.frame}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        width: `${width}%`,
        height: `${frameHeight}px`
      }}
    >
      <div className={locals.label}>{label}</div>
    </div>
  );
}
