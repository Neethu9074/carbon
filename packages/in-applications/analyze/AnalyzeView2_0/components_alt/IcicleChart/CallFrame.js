/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { just } from '@instana/observables';

import LogTooltipContent from 'in-applications/analyze/components/TraceDetails/components/LogTooltipContent';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import LogIndicator from 'in-applications/analyze/components/TraceDetails/components/LogIndicator';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import locals from './CallFrame.mless';

export const FRAME_HEIGHT = 24;

const CallFrame = forwardRef(function CallFrame(props, ref) {
  const { callFrame, xScale, getColor, onCallClicked, isFakeRoot, isOpened } = props;
  const { label, errorCount, depth, x, dx, totalDuration, traceStart, children = [] } = callFrame;

  const top = FRAME_HEIGHT * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - left;

  return (
    <div ref={ref}>
      <div
        className={classNames({
          [locals.frame]: true,
          [locals.isOpened]: isOpened,
          [locals.fakeRoot]: isFakeRoot
        })}
        style={{
          top: `${top}px`,
          left: `${left}%`,
          width: `${width}%`,
          height: `${FRAME_HEIGHT}px`,
          background: isFakeRoot ? theme.lib.colors.N400 : getColor(callFrame)
        }}
        onClick={isFakeRoot ? null : () => onCallClicked(callFrame)}
      >
        <ErrorIndicator className={locals.errorIndicator} erroneous={errorCount} inChart />
        <span className={locals.label}>{label}</span>
      </div>
      <div className={locals.logIndicatorContainer}>
        {children
          .filter(subCall => subCall.model === 'LOG')
          .map(subCall => (
            <LogIndicators
              {...props}
              parentCall={callFrame}
              key={subCall.id}
              top={top}
              log={subCall}
              x={totalDuration ? (subCall.start - traceStart) / totalDuration : 0}
            />
          ))}
      </div>
    </div>
  );
});

function LogIndicators(props) {
  const { log, xScale, x } = props;

  const left = xScale.getRange(x);

  return (
    <Tooltip themeStyle="light" content={getTooltipContent(log)} align="topMiddle">
      <LogIndicator {...props} inTimeline left={left} />
    </Tooltip>
  );
}

function getTooltipContent(log) {
  if (!role.canViewLogs) return null;
  return <LogTooltipContent log={log} />;
}

export default connectTo(
  props => ({
    isOpened:
      props.openedCallId != null
        ? just(props.callFrame.id === props.openedCallId)
        : props.openedCall$?.map(openedCall => openedCall && props.callFrame.id === openedCall).distinct()
  }),
  CallFrame
);
