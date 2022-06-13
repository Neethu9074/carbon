/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';
import classNames from 'classnames';
import { Property } from 'csstype';

import { getTickStyle } from 'in-components/Axis/components/tickStyle';
import { FormatterObject } from 'in-components/Chart/types';
import { AxisAlign } from 'in-components/Axis/Axis';
import { Tick } from 'in-services/ticks/types';

import locals from './Ticks.mless';

interface TickLabelsProps {
  tickPositions: Tick[];
  formatter: FormatterObject;
  align: AxisAlign;
  tickLength: number;

  // See Ticks.mless for default colors
  tickColor?: Property.Color;
  backgroundColor?: Property.Color;

  isVertical?: boolean;
  detailedFormatting?: boolean;
}

export default function TickLabels({
  tickPositions,
  isVertical = false,
  formatter,
  align,
  tickLength,
  detailedFormatting,
  tickColor,
  backgroundColor
}: TickLabelsProps) {
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
