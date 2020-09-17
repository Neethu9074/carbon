import { area, stackedArea, bar, stackedBar, barOverlapping, integral, line, point } from 'in-stores/metric/renderer';

export const defaultRenderer = line;
export const renderer = [area, stackedArea, bar, stackedBar, barOverlapping, integral, line, point];

export const allRendererIds = renderer.map(c => c.id);
