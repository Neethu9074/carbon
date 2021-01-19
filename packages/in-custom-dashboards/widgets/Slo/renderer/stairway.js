/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { drawPoint } from 'in-components/Chart/renderer/point';

export const hourlyBudgetMetricId = 'hourlyBudget';

export default {
  render: ({ color, scale, config, dataSeries, metricId }) => {
    if (!dataSeries || dataSeries.length === 0) {
      return;
    }

    if (dataSeries.length === 1) {
      // only draw a dot if just a single data point is available
      const dataPoint = dataSeries[0];
      const posX = config.xScaleBackBuffer.getRange(dataPoint[0]);
      const posY = scale.getRange(dataPoint[1]);
      config.backBufferCtx.beginPath();
      drawPoint(config, posX, posY, color);
      config.backBufferCtx.stroke();
      return;
    }

    const lineWidth = config.y1?.lineWidth ?? 2;
    const isStaticBudget = config.y1?.isStaticBudget ?? false;
    const markerPaneHeight = config.markerPaneHeight;

    // we want to shift the metric half a "bucket" to the left, to that the plateau is in the middle
    const stepDelta =
      config.xScaleBackBuffer.getRange(dataSeries[1][0]) - config.xScaleBackBuffer.getRange(dataSeries[0][0]);
    const shiftX = stepDelta / 2.0;

    let previousPosY;
    const lineVertices = [];

    // extend first value by half a bucket
    const firstDataPoint = dataSeries[0];
    const firstPosX = config.xScaleBackBuffer.getRange(firstDataPoint[0]);
    if (isStaticBudget) {
      // extend first value as is
      const posY = scale.getRange(firstDataPoint[1]);
      lineVertices.push([firstPosX - stepDelta, posY]);
    } else {
      // extend fist value as new zero-step if the budget is hourly changing
      const posY = scale.getRange(0);
      lineVertices.push([firstPosX - stepDelta, posY]);
      lineVertices.push([firstPosX - shiftX, posY]);
    }

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }

      const posX = config.xScaleBackBuffer.getRange(dataPoint[0]);
      const posY = scale.getRange(dataPoint[1]);
      if (previousPosY) {
        lineVertices.push([posX - shiftX, previousPosY]);
      }
      lineVertices.push([posX - shiftX, posY]);

      previousPosY = posY;
    }

    // extend last value by half a bucket
    const posX = config.xScaleBackBuffer.getRange(dataSeries[dataSeries.length - 1][0]);
    lineVertices.push([posX + shiftX, previousPosY]);

    config.backBufferCtx.beginPath();
    config.backBufferCtx.strokeStyle = color;
    config.backBufferCtx.lineWidth = lineWidth;
    drawLines(lineVertices, config);
    config.backBufferCtx.stroke();

    // FIXME currently the renderer is dependent that this specific metricId is used, to apply filled background just
    //       for this specific metric. There must be a better way to parameterize one of the metrics that this one is
    //       rendered differently from the others, similar to assigning them different colors
    const fillTopBackground = metricId === hourlyBudgetMetricId;

    if (fillTopBackground) {
      const startVertex = lineVertices[0];
      const endVertex = lineVertices[lineVertices.length - 1];

      // background are above
      config.backBufferCtx.save();
      config.backBufferCtx.beginPath();
      config.backBufferCtx.fillStyle = color;
      config.backBufferCtx.globalAlpha = 0.25;
      drawLines(lineVertices, config);
      config.backBufferCtx.lineTo(endVertex[0], markerPaneHeight);
      config.backBufferCtx.lineTo(startVertex[0], markerPaneHeight);
      config.backBufferCtx.closePath();
      config.backBufferCtx.fill();
      config.backBufferCtx.restore();
    }
  }
};

function drawLines(lineVertices, config) {
  const startVertex = lineVertices[0];
  config.backBufferCtx.moveTo(startVertex[0], startVertex[1]);
  for (let i = 1; i < lineVertices.length; i++) {
    const thisVertex = lineVertices[i];
    config.backBufferCtx.lineTo(thisVertex[0], thisVertex[1]);
  }
}
