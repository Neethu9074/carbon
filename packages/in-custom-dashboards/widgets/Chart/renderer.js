import Renderer from 'in-components/Chart/renderer/Renderer';

export const defaultRenderer = {
  id: 'line',
  label: 'Line',
  renderer: Renderer.line
};

export const renderer = [
  {
    id: 'area',
    label: 'Area',
    renderer: Renderer.area
  },
  {
    id: 'stackedArea',
    label: 'Area (stacked)',
    renderer: Renderer.stackedArea
  },
  {
    id: 'bar',
    label: 'Bar',
    renderer: Renderer.bar
  },
  {
    id: 'stackedBar',
    label: 'Bar (stacked)',
    renderer: Renderer.stackedBar
  },
  {
    id: 'integral',
    label: 'Integral',
    renderer: Renderer.integral
  },
  defaultRenderer,
  {
    id: 'point',
    label: 'Point',
    renderer: Renderer.point
  }
];
