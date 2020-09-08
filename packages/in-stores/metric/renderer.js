import PropTypes from 'prop-types';

import Renderer from 'in-components/Chart/renderer/Renderer';

export const area = {
  id: 'area',
  label: 'Area',
  renderer: Renderer.area
};
export const stackedArea = {
  id: 'stackedArea',
  label: 'Area (stacked)',
  renderer: Renderer.stackedArea
};
export const bar = {
  id: 'bar',
  label: 'Bar',
  renderer: Renderer.bar
};
export const stackedBar = {
  id: 'stackedBar',
  label: 'Bar (stacked)',
  renderer: Renderer.stackedBar
};
export const integral = {
  id: 'integral',
  label: 'Integral',
  renderer: Renderer.integral
};
export const line = {
  id: 'line',
  label: 'Line',
  renderer: Renderer.line
};
export const point = {
  id: 'point',
  label: 'Point',
  renderer: Renderer.point
};

export const allRenderers = [line, area, stackedArea, bar, stackedBar, integral, point];
export const allRendererIds = allRenderers.map(({ id }) => id);

export const rendererIdPropType = PropTypes.oneOf(allRendererIds);
export const rendererShape = PropTypes.shape({
  id: rendererIdPropType.isRequired,
  label: PropTypes.string.isRequired,
  renderer: PropTypes.any
});
