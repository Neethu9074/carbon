import connect from 'in-hoc/connectTo';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './CallFrame.mless';

export const FRAME_HEIGHT = 22;

export default connect(
  props => ({
    isUnhighlighted: props.hoveredServiceEndpoint$
      .map(
        hoveredServiceEndpoint =>
          hoveredServiceEndpoint && !callIsInServiceEndpoint(props.callFrame, hoveredServiceEndpoint)
      )
      .distinct()
  }),
  CallFrame
);

function callIsInServiceEndpoint(call, serviceEndpoint) {
  return serviceEndpoint.service.id == call.service.id && serviceEndpoint.endpoint.id == call.endpoint.id;
}

function CallFrame({ callFrame, xScale, isUnhighlighted, getColor, onCallClicked }) {
  const { label, errorCount, depth, x, dx } = callFrame;

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
        background: getColor(callFrame)
      }}
      onClick={() => onCallClicked(callFrame)}
    >
      {errorCount ? <div className={locals.errorIndicator}>{errorCount}</div> : null}
      <div className={locals.label}>{label}</div>
    </div>
  );
}
