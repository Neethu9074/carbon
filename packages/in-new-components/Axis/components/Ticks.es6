import React, { Fragment } from 'react';

import { getTickStyle } from 'in-new-components/Axis/components/tickStyle';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Ticks.mless';

export default function Ticks({ tickPositions, isVertical, align, tickLength }) {
  return (
    <Fragment>
      {tickPositions.map(tick => {
        const style = getTickStyle(tick, isVertical, align, 0, 1);
        if (isVertical) {
          style.width = tickLength;
        } else {
          style.height = tickLength;
        }

        return (
          <div
            key={tick.range}
            style={style}
            className={evaluateClassNames({
              [locals.verticalTick]: isVertical,
              [locals.horizontalTick]: !isVertical
            })}
          />
        );
      })}
    </Fragment>
  );
}
