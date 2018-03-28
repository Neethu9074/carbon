import React, { Fragment } from 'react';

import createScale from 'in-charts/scale';
import Tooltip from 'in-components/Tooltip';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import { millis } from 'in-services/formatters/number';
import { applyLayout } from 'in-new-components/IcicleChart/IcicleLayout';
import getElementDimensions from 'in-hoc/getElementDimensions';

import locals from './IcicleChart.mless';

const frameHeight = 20;
const tooltipAlignment = 'topMiddle';

export default function IcicleChart({ rootSpan, getColor = () => '#1479ff', onSpanClick = () => {} }) {
  const spanFrames = applyLayout(rootSpan);

  let minDomain = 0;
  let maxDomain = 1;
  let minTime = rootSpan.start;
  let maxTime = rootSpan.start + rootSpan.duration;
  let maxDepth = 0;

  spanFrames.forEach(spanFrame => {
    minDomain = Math.min(minDomain, spanFrame.x);
    maxDomain = Math.max(maxDomain, spanFrame.x);
    minTime = Math.min(minTime, spanFrame.start);
    maxTime = Math.max(maxTime, spanFrame.start + spanFrame.duration);
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
      <TimeAxis start={0} end={maxTime - minTime} />

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

const TimeAxis = getElementDimensions(({ width, start, end }) => {
  return (
    <div className={locals.axis}>
      {width && (
        <HorizontalAxis
          formatter={millis}
          align="top"
          width={width}
          scale={{ from: start, to: end }}
          fixedTickPositions={[0, 0.2, 0.4, 0.6, 0.8, 1]}
        />
      )}
    </div>
  );
});

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
