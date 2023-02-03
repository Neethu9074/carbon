/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { Property } from 'csstype';
import React from 'react';

import { getTickStyle } from 'in-components/Axis/components/tickStyle';
import { AxisAlign } from 'in-components/Axis/Axis';
import { Tick } from 'in-services/ticks/types';

import locals from './Ticks.mless';

interface TicksProps {
  tickPositions: Tick[];
  align: AxisAlign;
  tickLength: number;
  tickColor?: Property.Color;

  isVertical?: boolean;
}

export default function Ticks({ tickPositions, isVertical = false, align, tickLength, tickColor }: TicksProps) {
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
