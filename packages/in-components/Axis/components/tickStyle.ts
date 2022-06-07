/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CSSProperties } from 'react';

import { AxisAlign } from 'in-components/Axis/Axis';
import { Tick } from 'in-services/ticks/types';

export function getTickStyle(
  tick: Tick,
  isVertical: boolean,
  align: AxisAlign,
  offset: number = 0,
  labelOffset: number = 0
): CSSProperties {
  const labelHeight = 14;
  if (isVertical) {
    if (align === 'right') {
      return {
        top: tick.range - labelHeight,
        right: 0,
        textAlign: 'end',
        width: 200
      };
    }
    return {
      top: tick.range - labelHeight,
      left: 0,
      textAlign: 'start'
    };
  }

  return {
    top: align === 'bottom' ? offset : undefined,
    left: tick.range - labelOffset,
    bottom: align === 'top' ? offset : undefined
  };
}
