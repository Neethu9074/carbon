/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import CallFrame, {
  FRAME_HEIGHT
} from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/CallFrame';
import { applyLayout } from 'in-applications/analyze/components/TraceDetails/components/IcicleChart/IcicleLayout';
import CallTimeAxis from 'in-applications/analyze/components/TraceDetails/components/CallTimeAxis/CallTimeAxis';
import CallTooltipContent from 'in-applications/analyze/components/TraceDetails/components/CallTooltipContent';
import { isFakeRootCall } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import { useLogsInCallsContext } from 'in-logging/components/TraceDetails/LogsInCallsContext';
import Tooltip from 'in-components/Tooltip';
import createScale from 'in-services/scale';

import locals from './IcicleChart.mless';

const tooltipAlignment = 'topMiddle';

export default function IcicleChart(props) {
  const { rootCall, getColor = () => '#1479ff' } = props;
  const { items: loggingLogItems } = useLogsInCallsContext();

  const callFrames = applyLayout(rootCall, loggingLogItems);

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
          .map((callFrame, idx) => {
            return (
              <Fragment key={callFrame.id + idx}>
                <Tooltip
                  themeStyle="light"
                  content={<CallTooltipContent call={callFrame} getColor={getColor} />}
                  align={tooltipAlignment}
                  overwriteBlock
                  forceTheme
                >
                  <CallFrame
                    {...props}
                    callFrame={callFrame}
                    xScale={xScale}
                    getColor={getColor}
                    isFakeRoot={isFakeRootCall(callFrame)}
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
