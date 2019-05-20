import React, { Fragment } from 'react';

import { getTickStyle } from 'in-new-components/Axis/components/tickStyle';
import { evaluateClassNames } from 'in-services/util/classnames';

import locals from './Ticks.mless';

export default function Ticks({
  tickPositions,
  isVertical,
  formatter,
  align,
  tickLength,
  detailedFormatting,
  tickColor
}) {
  return (
    <Fragment>
      {tickPositions.map(tick => {
        const style = getTickStyle(tick, isVertical, align, tickLength + 1, tickLength - 2);
        style.color = tickColor;
        return (
          <div
            key={tick.range}
            style={style}
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
