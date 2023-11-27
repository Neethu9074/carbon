/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { DataSeries, RenderConfig } from 'in-components/Chart/renderer/types';
import renderer from 'in-components/Chart/renderer/Renderer';
import { MetricDataSeries } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale/scale';

// This function is used to render the predictions in the graph. It is used to display the lower and upper bounds for predictions in the graph. It also adds predictions in form of a dotted line to the graph.

export function renderPredictions(config: RenderConfig, metrics: MetricDataSeries[], scale: ScaleType) {
  const metricIds = config?.y1?.metricIds ?? [];
  const colors100Arr = config?.y1?.colors100 ?? [];
  const colors50Arr = config?.y1?.colors50 ?? [];

  const { backBufferCtx, y1 } = config;
  const predictionsIndex = metricIds.findIndex((ids: string) => ids === 'predictions');

  if (predictionsIndex > 0) {
    const lowerBoundIndex = metricIds.findIndex((ids: string) => ids === 'lowerBound');
    const upperBoundIndex = metricIds.findIndex((ids: string) => ids === 'upperBound');

    // This is to display the lower and upper bounds for predictions in the graph.
    const { xScaleBackBuffer } = config;
    const xStart = metrics[upperBoundIndex].length > 0 ? xScaleBackBuffer.getRange(metrics[upperBoundIndex][0][0]) : 0;

    // `renderBackground` function is used in the graph to display the lower and upper bounds for predictions.It will also add a background color between the bottom and top bounds.
    renderBackground(
      xStart,
      metrics[upperBoundIndex],
      scale,
      config,
      metrics[lowerBoundIndex],
      colors50Arr[upperBoundIndex]
    );

    // `setLineDash([3, 3])` will add predictions in form of a dotted line to the graph.
    backBufferCtx.setLineDash([3, 3]);
    y1.lineWidth = 2;
    renderer.line.render({
      dataSeries: metrics[predictionsIndex],
      color: colors100Arr[predictionsIndex]!,
      scale,
      config
    });
  }
}

//`renderBackground` function is used in the graph to display the lower and upper bounds for predictions.It will also add a background color between the bottom and top bounds.
function renderBackground(
  xStart: number,
  upperBound: DataSeries,
  scale: ScaleType,
  config: RenderConfig,
  lowerBound: DataSeries,
  fillStyle: string
): void {
  const { backBufferCtx } = config;

  backBufferCtx.save();
  // color given to `fillStyle` is added as a background between the upperbound and lowerbound lines.
  backBufferCtx.fillStyle = fillStyle;

  backBufferCtx.beginPath();
  // `moveTo` method will set the path to a specified point without drawing a line
  backBufferCtx.moveTo(xStart, upperBound.length > 0 ? scale.getRange(upperBound[0][1]) : 0);

  // `drawLineGraphforUpperbound` will draw line for the upperbound
  drawLineGraphforUpperbound(upperBound.length, config, upperBound, scale);
  // `drawLineGraphforLowerbound` will draw line for the lowerBound
  drawLineGraphforLowerbound(lowerBound.length, config, lowerBound, scale);

  backBufferCtx.closePath();
  // The 'fill()' method will fill the background colour between the lower and upper bounds with the colour specified in the 'backBufferCtx.fillStyle' property.
  backBufferCtx.fill();
  backBufferCtx.restore();
}

// this function is to draw line for the upperbound
function drawLineGraphforUpperbound(len: number, config: RenderConfig, metric: DataSeries, scale: ScaleType): void {
  for (let i = 0; i < len; ++i) {
    config.backBufferCtx.lineTo(config.xScaleBackBuffer.getRange(metric[i][0]), scale.getRange(metric[i][1]));
  }
}

// this function is to draw line for the lowerbound
function drawLineGraphforLowerbound(len: number, config: RenderConfig, metric: DataSeries, scale: ScaleType): void {
  for (let i = len - 1; i >= 0; --i) {
    config.backBufferCtx.lineTo(config.xScaleBackBuffer.getRange(metric[i][0]), scale.getRange(metric[i][1]));
  }
}
