import React, { Fragment } from 'react';

import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent/CallTooltipContent';
import { applyLayout } from 'in-analyze/TraceDetail/components/IcicleChart/IcicleLayout';
import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import locals from './IcicleChart.mless';

const frameHeight = 22;
const tooltipAlignment = 'topMiddle';

export default function IcicleChart({ rootCall, getColor = () => '#1479ff', onCallClicked }) {
  const callFrames = applyLayout(rootCall);

  let minDomain = 0;
  let maxDomain = 1;
  let maxDepth = 0;

  callFrames.forEach(callFrame => {
    minDomain = Math.min(minDomain, callFrame.x);
    maxDomain = Math.max(maxDomain, callFrame.x);
    maxDepth = Math.max(maxDepth, callFrame.depth);
  });

  const chartHeight = (maxDepth + 1) * frameHeight;

  const xScale = createScale();
  xScale.setDomainFrom(minDomain);
  xScale.setDomainTo(maxDomain);
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  return (
    <div className={locals.chart}>
      <CallTimeAxis call={rootCall} />

      <div className={locals.framesWrapper} style={{ height: `${chartHeight}px` }}>
        {callFrames.map(callFrame => {
          const { id } = callFrame;

          return (
            <Fragment key={id}>
              <Tooltip content={<CallTooltipContent call={callFrame} />} align={tooltipAlignment}>
                <CallFrame callFrame={callFrame} xScale={xScale} getColor={getColor} onCallClicked={onCallClicked} />
              </Tooltip>
            </Fragment>
          );
        })}
      </div>
      <div />
    </div>
  );
}

function CallFrame({ callFrame, xScale, getColor, onCallClicked }) {
  const { label, errorCount, depth, x, dx } = callFrame;

  const top = frameHeight * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - xScale.getRange(x);

  return (
    <div
      className={locals.frame}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        width: `${width}%`,
        height: `${frameHeight}px`,
        background: getColor(callFrame)
      }}
      onClick={() => onCallClicked(callFrame)}
    >
      {errorCount ? <div className={locals.errorIndicator}>{errorCount}</div> : null}
      <div className={locals.label}>{label}</div>
    </div>
  );
}
