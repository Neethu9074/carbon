import connect from 'in-hoc/connectTo';
import React from 'react';

import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { FAKE_ROOT_ID } from 'in-analyze/TraceDetail/shared/CallHelper';
import { evaluateClassNames } from 'in-services/util/classnames';
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
  if (!call.service || call.endpoint) {
    return false;
  } else {
    return serviceEndpoint.service.id == call.service.id && serviceEndpoint.endpoint.id == call.endpoint.id;
  }
}

function CallFrame({ callFrame, xScale, isUnhighlighted, getColor, onCallClicked }) {
  const { id, label, errorCount, depth, x, dx } = callFrame;

  const top = FRAME_HEIGHT * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - left;

  return (
    <div
      className={evaluateClassNames({
        [locals.frame]: true,
        [locals.unhighlightedFrame]: isUnhighlighted
      })}
      style={{
        top: `${top}px`,
        left: `${left}%`,
        width: `${width}%`,
        height: `${FRAME_HEIGHT}px`,
        background: id == FAKE_ROOT_ID ? theme.lib.colors.N400 : getColor(callFrame)
      }}
      onClick={() => onCallClicked(callFrame)}
    >
      <ErrorIndicator className={locals.errorIndicator} errorCount={errorCount} />
      <span className={locals.label}>{label}</span>
    </div>
  );
}
