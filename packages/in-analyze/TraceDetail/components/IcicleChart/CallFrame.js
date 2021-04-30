/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { just } from '@instana/observables';

import LogTooltipContent from 'in-analyze/TraceDetail/components/LogTooltipContent';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import LogIndicator from 'in-analyze/TraceDetail/components/LogIndicator';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import theme from 'in-themes';

import locals from './CallFrame.mless';

export const FRAME_HEIGHT = 24;

function callIsInServiceEndpoint(call, serviceEndpoint) {
  if (!call.service || !call.endpoint || !serviceEndpoint.service || !serviceEndpoint.endpoint) {
    return false;
  } else {
    return serviceEndpoint.service.id == call.service.id && serviceEndpoint.endpoint.id == call.endpoint.id;
  }
}

const CallFrame = forwardRef(function CallFrame(props, ref) {
  const { callFrame, xScale, isUnhighlighted, getColor, onCallClicked, isFakeRoot, isOpened } = props;
  const { label, errorCount, depth, x, dx, totalDuration, traceStart, children } = callFrame;
  const top = FRAME_HEIGHT * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - left;

  return (
    <div ref={ref}>
      <div
        className={classNames({
          [locals.frame]: true,
          [locals.isOpened]: isOpened,
          [locals.unhighlightedFrame]: isUnhighlighted,
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
      <div
        className={classNames({
          [locals.logIndicatorContainer]: true,
          [locals.unhighlightedLogIndicator]: isUnhighlighted
        })}
      >
        {children &&
          children
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
    isUnhighlighted: props.hoveredServiceEndpoint$
      ? props.hoveredServiceEndpoint$
          .map(
            hoveredServiceEndpoint =>
              hoveredServiceEndpoint && !callIsInServiceEndpoint(props.callFrame, hoveredServiceEndpoint)
          )
          .distinct()
      : false,
    isOpened:
      props.openedCallId != null
        ? just(props.callFrame.id === props.openedCallId)
        : props.openedCall$?.map(openedCall => openedCall && props.callFrame.id === openedCall).distinct()
  }),
  CallFrame
);
