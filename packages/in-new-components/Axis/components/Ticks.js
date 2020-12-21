import React from 'react';

import { getTickStyle } from 'in-new-components/Axis/components/tickStyle';
import classNames from 'classnames';

import locals from './Ticks.mless';

export default function Ticks({ tickPositions, isVertical, align, tickLength, tickColor }) {
  return (
    <>
      {tickPositions.map(tick => {
        const style = getTickStyle(tick, isVertical, align, 0, 1);
        if (isVertical) {
          style.width = tickLength;
        } else {
          style.height = tickLength;
        }
        style.background = tickColor;

        return (
          <div
            key={tick.range}
            style={style}
            className={classNames({
              [locals.verticalTick]: isVertical,
              [locals.horizontalTick]: !isVertical
            })}
          />
        );
      })}
    </>
  );
}
