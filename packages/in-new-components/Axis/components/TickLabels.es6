import React, { Fragment } from 'react';

import { getTickStyle } from 'in-new-components/Axis/components/tickStyle';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Ticks.mless';

export default function Ticks({ tickPositions, isVertical, formatter, align }) {
  return (
    <Fragment>
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
