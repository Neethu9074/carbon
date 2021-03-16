/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import CallFrame, { FRAME_HEIGHT } from 'in-analyze/TraceDetail/components/IcicleChart/CallFrame';
import { applyLayout } from 'in-analyze/TraceDetail/components/IcicleChart/IcicleLayout';
import CallTimeAxis from 'in-analyze/TraceDetail/components/CallTimeAxis/CallTimeAxis';
import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent';
import { isFakeRootCall } from 'in-analyze/TraceDetail/shared/CallHelper';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';

import locals from './IcicleChart.mless';

const tooltipAlignment = 'topMiddle';

export default function IcicleChart({
  rootCall,
  getColor = () => '#1479ff',
  onCallClicked,
  hoveredServiceEndpoint$,
  openedCall$
}) {
  const callFrames = applyLayout(rootCall);

  const maxDepth = callFrames.reduce((max, callFrame) => Math.max(max, callFrame.depth), 0);
  const chartHeight = (maxDepth + 1) * FRAME_HEIGHT;

  const xScale = createScale();
  xScale.setDomainFrom(0);
  xScale.setDomainTo(1);
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  return (
    <div className={locals.chart}>
      <CallTimeAxis showStartLabel call={rootCall} />

      <div className={locals.framesWrapper} style={{ height: `${chartHeight}px` }}>
        {callFrames
          .filter(callFrame => callFrame.model !== 'LOG')
          .map(callFrame => {
            return (
              <Fragment key={callFrame.id}>
                <Tooltip
                  themeStyle="light"
                  content={<CallTooltipContent call={callFrame} getColor={getColor} />}
                  align={tooltipAlignment}
                >
                  <CallFrame
                    callFrame={callFrame}
                    xScale={xScale}
                    getColor={getColor}
                    onCallClicked={onCallClicked}
                    hoveredServiceEndpoint$={hoveredServiceEndpoint$}
                    isFakeRoot={isFakeRootCall(callFrame)}
                    openedCall$={openedCall$}
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
