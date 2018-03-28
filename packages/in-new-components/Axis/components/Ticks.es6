import React, { Fragment } from 'react';

import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Ticks.mless';

export default function Ticks({ tickPositions, isVertical, formatter, align }) {
  return (
    <Fragment>
      {tickPositions.map(tick => {
        return (
          <div
            key={tick.range}
            style={getTickStyle(tick, isVertical, align, 0, 1)}
            className={evaluateClassNames({
              [locals.verticalTick]: isVertical,
              [locals.horizontalTick]: !isVertical
            })}
          />
        );
      })}
      {tickPositions.map(tick => {
        return (
          <div
            key={tick.range}
            style={getTickStyle(tick, isVertical, align, 5, 6)}
            className={evaluateClassNames({
              [locals.verticalTickLabel]: isVertical,
              [locals.horizontalTickLabel]: !isVertical
            })}
          >
            {formatter.compact(tick.domain)}
          </div>
        );
      })}
    </Fragment>
  );
}

function getTickStyle(tick, isVertical, align, offset = 0, labelOffset = 0) {
  if (isVertical) {
    return {
      bottom: tick.range - labelOffset,
      left: align === 'right' && offset,
      right: align === 'left' && offset
    };
  }

  return {
    top: align === 'bottom' && offset,
    left: tick.range - labelOffset,
    bottom: align === 'top' && offset
  };
}
