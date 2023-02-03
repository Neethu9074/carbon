/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';

import Renderer from 'in-components/Chart/renderer/Renderer';
import { t } from 'in-i18n';

export const area = {
  id: 'area',
  label: t('in-stores:metric.rendererLabelArea'),
  renderer: Renderer.area
};
export const stackedArea = {
  id: 'stackedArea',
  label: t('in-stores:metric.rendererLabelAreaStacked'),
  renderer: Renderer.stackedArea
};
export const bar = {
  id: 'bar',
  label: t('in-stores:metric.rendererLabelBar'),
  renderer: Renderer.bar
};
export const stackedBar = {
  id: 'stackedBar',
  label: t('in-stores:metric.rendererLabelBarStacked'),
  renderer: Renderer.stackedBar
};
export const barOverlapping = {
  id: 'barOverlapping',
  label: t('in-stores:metric.rendererLabelBarOverlapping'),
  renderer: Renderer.barOverlapping
};
export const integral = {
  id: 'integral',
  label: t('in-stores:metric.rendererLabelIntegral'),
  renderer: Renderer.integral
};
export const line = {
  id: 'line',
  label: t('in-stores:metric.rendererLabelLine'),
  renderer: Renderer.line
};
export const point = {
  id: 'point',
  label: t('in-stores:metric.rendererLabelPoint'),
  renderer: Renderer.point
};
export const pie = {
  id: 'pie',
  label: t('in-stores:metric.rendererLabelPie'),
  renderer: Renderer.pie
};

export const allRenderers = [line, area, stackedArea, bar, stackedBar, barOverlapping, integral, point];
export const allRendererIds = allRenderers.map(({ id }) => id);

export const rendererIdPropType = PropTypes.oneOf(allRendererIds);
export const rendererShape = PropTypes.shape({
  id: rendererIdPropType.isRequired,
  label: PropTypes.string.isRequired,
  renderer: PropTypes.any
});
