/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

import { themes } from '@instana/design-tokens';
import { just } from '@instana/observables';

import { convertToCallLogs } from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/utils';
import LogTooltipContent from 'in-applications/analyze/components/TraceDetails/components/LogTooltipContent';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import LogIndicator from 'in-applications/analyze/components/TraceDetails/components/LogIndicator';
import { useLogsInCallsContext } from 'in-logging/components/TraceDetails/LogsInCallsContext';
import { filterOtelLogs } from 'in-logging/components/TraceDetails/utils';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

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
  const { items: loggingLogItems } = useLogsInCallsContext();
  const { callFrame, xScale, isUnhighlighted, getColor, onCallClicked, isFakeRoot, isOpened } = props;
  const { label, errorCount, depth, x, dx, totalDuration, traceStart, children } = callFrame;
  const top = FRAME_HEIGHT * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - left;

  const nonSpanLogs = convertToCallLogs(loggingLogItems.filter(filterOtelLogs(callFrame)));
  const spanLogs = children?.filter(subCall => subCall.model === 'LOG') ?? [];

  const logs = [...nonSpanLogs, ...spanLogs];

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
          background: isFakeRoot ? themes.default.ids.color.option.neutral['400'] : getColor(callFrame)
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
        {logs.map((log, idx) => (
          <LogIndicators
            {...props}
            parentCall={callFrame}
            key={idx}
            top={top}
            log={log}
            x={totalDuration ? (log.start - traceStart) / totalDuration : 0}
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
    <Tooltip themeStyle="light" forceTheme content={getTooltipContent(log)} align="auto">
      <LogIndicator {...props} inTimeline left={left} />
    </Tooltip>
  );
}

function getTooltipContent(log) {
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
