import connect from 'in-hoc/connectTo';
import React from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './IcicleChart.mless';

export const FRAME_HEIGHT = 22;

export default connect(
  props => ({
    isUnhighlighted: props.hoveredServiceEndpoint$
      .map(
        hoveredServiceEndpoint =>
          hoveredServiceEndpoint &&
          (hoveredServiceEndpoint.service.id != props.callFrame.service.id ||
            hoveredServiceEndpoint.endpoint.id != props.callFrame.endpoint.id)
      )
      .distinct()
  }),
  CallFrame
);

function CallFrame({ callFrame, xScale, isUnhighlighted, getColor, onCallClicked }) {
  const { label, errorCount, depth, x, dx } = callFrame;

  const top = FRAME_HEIGHT * depth;
  const left = xScale.getRange(x);
  const width = xScale.getRange(x + dx) - xScale.getRange(x);

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
