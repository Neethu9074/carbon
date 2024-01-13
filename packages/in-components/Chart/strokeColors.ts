/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Property } from 'csstype';

import { chartColors } from 'in-themes/chartColors';
import { Axis } from 'in-components/Chart/types';

export function enrichAxisWithColors(axis: Axis, offset = 0) {
  if (axis.colors100 && axis.colors50) {
    return;
  }

  const colors = chartColors.strokeColors25;

  axis.colors = axis.colors?.slice() || [];
  axis.colors50 = [];
  axis.colors100 = [];
  for (let i = 0; i < (axis.labels?.length || 0); i++) {
    const color = axis.colors[i] || colors[(i + offset) % colors.length];
    const { c25, c50, c100 } = getColorWithTransparency(color);
    axis.colors[i] = c25;
    axis.colors50.push(c50);
    axis.colors100.push(c100);
  }
}

export interface ColorWithTransparency {
  c25: Property.Color;
  c50: Property.Color;
  c100: Property.Color;
}

export function getColorWithTransparency(color: Property.Color): ColorWithTransparency {
  const color25Index = chartColors.strokeColors25.indexOf(color);
  if (color25Index >= 0) {
    return {
      c25: color,
      c50: chartColors.strokeColors50[color25Index],
      c100: chartColors.strokeColors100[color25Index]
    };
  }

  const color50Index = chartColors.strokeColors50.indexOf(color);
  if (color50Index >= 0) {
    return {
      c25: chartColors.strokeColors25[color50Index],
      c50: color,
      c100: chartColors.strokeColors100[color50Index]
    };
  }

  const color100Index = chartColors.strokeColors100.indexOf(color);
  if (color100Index >= 0) {
    return {
      c25: chartColors.strokeColors25[color100Index],
      c50: chartColors.strokeColors50[color100Index],
      c100: color
    };
  }

  if (color === chartColors.self25 || color === chartColors.self100) {
    return {
      c25: chartColors.self25,
      c50: chartColors.self25,
      c100: chartColors.self100
    };
  }

  return {
    c25: color,
    c50: color,
    c100: color
  };
}
