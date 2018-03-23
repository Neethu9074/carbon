import React from 'react';

import createScale from 'in-charts/scale';
import { applyLayout } from './IcicleLayout';

import './IcicleChart.less';

export default function IcicleChart({ rootSpan }) {
  const xScale = createScale();
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  const spanFrames = applyLayout(rootSpan);

  return (
    <div className={block}>
      <div className={`${block}__frame-wrapper`}>
        {spanFrames
          .toArray()
          .map(spanFrame => <SpanFrame key={spanFrame.get('id')} spanFrame={spanFrame} xScale={xScale} />)}
      </div>
    </div>
  );
}

const block = 'in-icicle-chart';
const frameHeight = 20;

function SpanFrame({ spanFrame, xScale }) {
  const top = frameHeight * spanFrame.get('depth');
  const left = xScale.getRange(spanFrame.get('x'));
  const width = xScale.getRange(spanFrame.get('dx'));

  let classesForSpanFrame = `${block}__frame`;

  return (
    <div
      className={classesForSpanFrame}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        width: `${width}%`,
        height: `${frameHeight}px`
      }}
    >
      <span>{spanFrame.get('label')}</span>
    </div>
  );
}
