import React, { Fragment } from 'react';

import CallFrame, { FRAME_HEIGHT } from 'in-analyze/TraceDetail/components/IcicleChart/CallFrame';
import { applyLayout } from 'in-analyze/TraceDetail/components/IcicleChart/IcicleLayout';
import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';
import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-charts/scale';

import locals from './IcicleChart.mless';

const tooltipAlignment = 'topMiddle';

export default function IcicleChart({ rootCall, getColor = () => '#1479ff', onCallClicked, hoveredServiceEndpoint$ }) {
  const callFrames = applyLayout(rootCall);

  let minDomain = 0;
  let maxDomain = 1;
  let maxDepth = 0;

  callFrames.forEach(callFrame => {
    minDomain = Math.min(minDomain, callFrame.x);
    maxDomain = Math.max(maxDomain, callFrame.x);
    maxDepth = Math.max(maxDepth, callFrame.depth);
  });

  const chartHeight = (maxDepth + 1) * FRAME_HEIGHT;

  const xScale = createScale();
  xScale.setDomainFrom(minDomain);
  xScale.setDomainTo(maxDomain);
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  return (
    <div className={locals.chart}>
      <CallTimeAxis showStartLabel call={rootCall} />

      <div className={locals.framesWrapper} style={{ height: `${chartHeight}px` }}>
        {callFrames.map(callFrame => {
          return (
            <Fragment key={callFrame.id}>
              <Tooltip themeStyle="light" content={<CallTooltipContent call={callFrame} />} align={tooltipAlignment}>
                <CallFrame
                  callFrame={callFrame}
                  xScale={xScale}
                  getColor={getColor}
                  onCallClicked={onCallClicked}
                  hoveredServiceEndpoint$={hoveredServiceEndpoint$}
                />
              </Tooltip>
            </Fragment>
          );
        })}
      </div>
      <div />
    </div>
  );
}
