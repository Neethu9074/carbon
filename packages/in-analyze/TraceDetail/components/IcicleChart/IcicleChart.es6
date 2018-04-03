import React, { Fragment } from 'react';

import { applyLayout } from 'in-analyze/TraceDetail/components/IcicleChart/IcicleLayout';
import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import locals from './IcicleChart.mless';

const frameHeight = 22;
const tooltipAlignment = 'topMiddle';

export default function IcicleChart({ rootSpan, getColor = () => '#1479ff', onSpanClick = () => {} }) {
  const spanFrames = applyLayout(rootSpan);

  let minDomain = 0;
  let maxDomain = 1;
  let maxDepth = 0;

  spanFrames.forEach(spanFrame => {
    minDomain = Math.min(minDomain, spanFrame.x);
    maxDomain = Math.max(maxDomain, spanFrame.x);
    maxDepth = Math.max(maxDepth, spanFrame.depth);
  });

  const chartHeight = (maxDepth + 1) * frameHeight;

  const xScale = createScale();
  xScale.setDomainFrom(minDomain);
  xScale.setDomainTo(maxDomain);
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  return (
    <div className={locals.chart}>
      <CallTimeAxis call={rootSpan} />

      <div className={locals.framesWrapper} style={{ height: `${chartHeight}px` }}>
        {spanFrames.map(spanFrame => {
          const { id, label, parent } = spanFrame;
          const parentDepth = parent ? spanFrames.find(obj => obj.id === parent).depth : 0;

          return (
            <Fragment key={id}>
              <Tooltip content={label} align={tooltipAlignment}>
                <SpanFrame spanFrame={spanFrame} xScale={xScale} getColor={getColor} onSpanClick={onSpanClick} />
              </Tooltip>
              <ParentSpanIndicator spanFrame={spanFrame} xScale={xScale} parentDepth={parentDepth} />
            </Fragment>
          );
        })}
      </div>
      <div />
    </div>
  );
}

function SpanFrame({ spanFrame, xScale, getColor, onSpanClick }) {
  const { label, errorCount, depth, x, dx } = spanFrame;

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
      onClick={() => onSpanClick(spanFrame.id, spanFrame.service.id, spanFrame.endpoint.id)}
    >
      {errorCount ? <div className={locals.errorIndicator}>{errorCount}</div> : null}
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
      className={locals.parentIndicator}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        height: `${height}px`
      }}
    />
  );
}
