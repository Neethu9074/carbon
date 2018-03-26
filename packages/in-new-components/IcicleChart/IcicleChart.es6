import React, { Fragment } from 'react';

import createScale from 'in-charts/scale';
import Tooltip from 'in-components/Tooltip';
import { applyLayout } from 'in-new-components/IcicleChart/IcicleLayout';

import locals from './IcicleChart.mless';

const tooltipAlignment = 'topMiddle';

export default function IcicleChart({ rootSpan, getColor = () => 'blue' }) {
  const xScale = createScale();
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  const spanFrames = applyLayout(rootSpan);

  return (
    <div className={locals.chart}>
      {spanFrames.map(spanFrame => {
        const parentDepth = spanFrame.parent ? spanFrames.find(obj => obj.id === spanFrame.parent).depth : 0;

        return (
          <Fragment key={spanFrame.id}>
            <Tooltip content={spanFrame.label} align={tooltipAlignment}>
              <SpanFrame spanFrame={spanFrame} xScale={xScale} getColor={getColor} />
            </Tooltip>
            <ParentSpanIndicator spanFrame={spanFrame} xScale={xScale} parentDepth={parentDepth} />
          </Fragment>
        );
      })}
    </div>
  );
}

const frameHeight = 20;

function SpanFrame({ spanFrame, xScale, getColor }) {
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
        height: `${frameHeight}px`,
        background: getColor(spanFrame)
      }}
    >
      <div className={locals.label}>{label}</div>
    </div>
  );
}

function ParentSpanIndicator({ spanFrame, xScale, parentDepth }) {
  const { depth, x } = spanFrame;

  if (depth - parentDepth == 1) {
    return null;
  }

  const top = frameHeight * (parentDepth + 0.5);
  const left = xScale.getRange(x);
  const height = frameHeight * (depth - parentDepth);

  return (
    <div
      className={locals.indicator}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        height: `${height}px`
      }}
    />
  );
}
