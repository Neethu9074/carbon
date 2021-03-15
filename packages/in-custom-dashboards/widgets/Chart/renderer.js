/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  area,
  bar,
  barOverlapping,
  integral,
  line,
  pie,
  point,
  stackedArea,
  stackedBar
} from 'in-stores/metric/renderer';

export const defaultRenderer = line;
export const renderer = [area, stackedArea, bar, stackedBar, barOverlapping, integral, line, point, pie];
export const userSelectableRenderer = [area, stackedArea, bar, stackedBar, integral, line, point];
export const enforceSingleNumberResult = [pie];

export const allRendererIds = renderer.map(c => c.id);
