/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import LineMetricRenderer from 'in-components/SparkChart/LineMetricRenderer';
import { updateCanvasDimensions } from 'in-components/Chart/canvas';

export default class SparkChart {
  constructor(canvas, { width, height, percentageMetric, theme = 'light' }) {
    this.canvas = canvas;

    updateCanvasDimensions(canvas, canvas.getContext('2d'), width, height);

    this.lineMetricRenderer = new LineMetricRenderer(canvas, {
      theme,
      width,
      height,
      percentageMetric,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2
    });
  }

  update(props) {
    this.lineMetricRenderer.update(props);
    this.lineMetricRenderer.render();
  }

  dispose() {
    this.lineMetricRenderer = null;
  }
}
