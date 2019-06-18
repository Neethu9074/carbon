import connect from 'in-hoc/connectTo';
import React, { Fragment } from 'react';

import CallTooltipContent from 'in-analyze/TraceDetail/components/CallTooltipContent';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import LogIndicator from 'in-analyze/TraceDetail/components/LogIndicator';
import { evaluateClassNames } from 'in-services/util/classnames';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';

import locals from './CallFrame.mless';

export const FRAME_HEIGHT = 24;

export default connect(
  props => ({
    isUnhighlighted: props.hoveredServiceEndpoint$
      ? props.hoveredServiceEndpoint$
          .map(
            hoveredServiceEndpoint =>
              hoveredServiceEndpoint && !callIsInServiceEndpoint(props.callFrame, hoveredServiceEndpoint)
          )
          .distinct()
      : false
  }),
  CallFrame
);

function callIsInServiceEndpoint(call, serviceEndpoint) {
  if (!call.service || !call.endpoint || !serviceEndpoint.service || !serviceEndpoint.endpoint) {
    return false;
  } else {
    return serviceEndpoint.service.id == call.service.id && serviceEndpoint.endpoint.id == call.endpoint.id;
  }
}

function CallFrame({ callFrame, xScale, isUnhighlighted, getColor, onCallClicked, isFakeRoot }) {
  const { label, errorCount, depth, x, dx, totalDuration, traceStart, children } = callFrame;
  const top = FRAME_HEIGHT * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - left;

  return (
    <Fragment>
      <div
        className={evaluateClassNames({
          [locals.frame]: true,
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
        <ErrorIndicator className={locals.errorIndicator} errorCount={errorCount} />
        <span className={locals.label}>{label}</span>
      </div>
      <div
        className={evaluateClassNames({
          [locals.logIndicatorContainer]: true,
          [locals.unhighlightedLogIndicator]: isUnhighlighted
        })}
      >
        {children.filter(subCall => subCall.model === 'LOG').map(subCall => (
          <LogIndicators
            parentCall={callFrame}
            key={subCall.id}
            top={top}
            log={subCall}
            xScale={xScale}
            onCallClicked={onCallClicked}
            x={totalDuration ? (subCall.start - traceStart) / totalDuration : 0}
          />
        ))}
      </div>
    </Fragment>
  );
}

function LogIndicators({ parentCall, log, xScale, x, top, onCallClicked }) {
  const left = xScale.getRange(x);
  return (
    <Tooltip themeStyle="light" content={<CallTooltipContent call={log} />} align="topMiddle">
      <LogIndicator inTimeline top={top} left={left} parentCall={parentCall} onCallClicked={onCallClicked} log={log} />
    </Tooltip>
  );
}
