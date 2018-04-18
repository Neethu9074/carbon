import React, { Fragment } from 'react';

import { getTickStyle } from 'in-new-components/Axis/components/tickStyle';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Ticks.mless';

export default function Ticks({ tickPositions, isVertical, formatter, align, tickLength, detailedFormatting }) {
  return (
    <Fragment>
      {tickPositions.map(tick => {
        return (
          <div
            key={tick.range}
            style={getTickStyle(tick, isVertical, align, tickLength + 1, tickLength + 2)}
            className={evaluateClassNames({
              [locals.verticalTickLabel]: isVertical,
              [locals.horizontalTickLabel]: !isVertical
            })}
          >
            {detailedFormatting ? formatter.detailed(tick.domain) : formatter.compact(tick.domain)}
          </div>
        );
      })}
    </Fragment>
  );
}
