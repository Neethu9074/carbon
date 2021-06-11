/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import CallFrame, { FRAME_HEIGHT } from 'in-applications/analyze/AnalyzeView2_0/components_alt/IcicleChart/CallFrame';
import CallTooltipContent from 'in-applications/analyze/components/TraceDetails/components/CallTooltipContent';
import { applyLayout } from 'in-applications/analyze/AnalyzeView2_0/components_alt/IcicleChart/IcicleLayout';
import { isFakeRootCall } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import CallTimeAxis from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTimeAxis';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';

import locals from './IcicleChart.mless';

const tooltipAlignment = 'topMiddle';

export default function IcicleChart(props) {
  const { rootCall, getColor = () => '#1479ff' } = props;

  const [xScale] = useState(createScale());
  xScale.setDomainFrom(0);
  xScale.setDomainTo(1);
  xScale.setRangeFrom(0);
  xScale.setRangeTo(100);

  const callFrames = applyLayout(rootCall);

  const maxDepth = callFrames.reduce((max, callFrame) => Math.max(max, callFrame.depth), 0);
  const chartHeight = (maxDepth + 1) * FRAME_HEIGHT;

  return (
    <div className={locals.chart}>
      <CallTimeAxis call={rootCall} />

      <div className={locals.framesWrapper} style={{ height: `${chartHeight}px` }}>
        {callFrames
          .filter(callFrame => callFrame.model !== 'LOG')
          .map(callFrame => {
            return (
              <Tooltip
                key={callFrame.id}
                themeStyle="light"
                content={<CallTooltipContent call={callFrame} getColor={getColor} />}
                align={tooltipAlignment}
              >
                <CallFrame
                  {...props}
                  callFrame={callFrame}
                  xScale={xScale}
                  getColor={getColor}
                  isFakeRoot={isFakeRootCall(callFrame)}
                />
              </Tooltip>
            );
          })}
      </div>
      <div />
    </div>
  );
}
