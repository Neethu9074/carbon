import {
  area,
  stackedArea,
  bar,
  stackedBar,
  integral,
  line,
  point
} from 'in-stores/metric/renderer';

export const defaultRenderer = line;
export const renderer = [
  area,
  stackedArea,
  bar,
  stackedBar,
  integral,
  line,
  point
];

export const allRendererIds = renderer.map(c => c.id);
