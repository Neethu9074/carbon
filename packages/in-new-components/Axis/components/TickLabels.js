/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';

import { getTickStyle } from 'in-new-components/Axis/components/tickStyle';

import locals from './Ticks.mless';

export default function Ticks({
  tickPositions,
  isVertical,
  formatter,
  align,
  tickLength,
  detailedFormatting,
  tickColor,
  backgroundColor
}) {
  return (
    <Fragment>
      {tickPositions.map(tick => {
        const style = getTickStyle(tick, isVertical, align, tickLength + 1, tickLength - 2);
        style.color = tickColor;
        style.backgroundColor = backgroundColor;
        return (
          <div
            key={tick.range}
            style={style}
            className={classNames({
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
