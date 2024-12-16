/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import LineMetricRenderer, { LineMetricUpdateProps } from 'in-components/SparkChart/LineMetricRenderer';
import { updateCanvasDimensions } from 'in-components/Chart/canvas';

export interface SparkChartProps {
  width: number;
  height: number;
  percentageMetric?: boolean;
  showDots?: boolean;
  theme?: string;
  strokeColor?: string;
  fillColor?: string;
}

export default class SparkChart {
  canvas: HTMLCanvasElement;
  lineMetricRenderer: LineMetricRenderer | null;

  constructor(
    canvas: HTMLCanvasElement,
    { width, height, percentageMetric, theme = 'light', strokeColor, fillColor, showDots = false }: SparkChartProps
  ) {
    this.canvas = canvas;

    updateCanvasDimensions(canvas, canvas.getContext('2d')!, width, height);

    this.lineMetricRenderer = new LineMetricRenderer(canvas, {
      theme,
      strokeColor,
      fillColor,
      width,
      height,
      percentageMetric,
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: 2,
      paddingBottom: 2,
      showDots
    });
  }

  update(props: LineMetricUpdateProps): void {
    this.lineMetricRenderer?.update(props);
    this.lineMetricRenderer?.render();
  }

  dispose(): void {
    this.lineMetricRenderer = null;
  }
}
