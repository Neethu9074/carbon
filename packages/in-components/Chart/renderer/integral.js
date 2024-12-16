/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

let layerBuffer;
let layerBufferCtx;

import { extrapolateMissingStackedAreaValuesEnabled } from 'in-services/featureFlags';
import { calculateMetricMap } from 'in-components/Chart/renderer/utils';
import { updateCanvasDimensions } from 'in-components/Chart/canvas';
import { createCanvas } from 'in-components/Chart/canvasHelper';
import { copyCanvasInto } from 'in-components/Chart/canvas';
import { drawCircleWithLine } from './utils';

export default {
  render: ({ metrics, colors, colors100, scale, config, axis, axisName }) => {
    if (!layerBuffer) {
      layerBuffer = createCanvas();
    }
    layerBufferCtx = layerBuffer.getContext('2d');
    resizeLayerBuffer(config);
    layerBufferCtx.lineWidth = 2;

    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics, axis.extrapolateMissingMetrics);
    }

    for (let iMetric = metrics.length - 1; iMetric >= 0; iMetric--) {
      renderDataSeries(
        config,
        metrics[iMetric],
        metricMap,
        scale,
        iMetric === 0,
        colors100[iMetric],
        colors[iMetric],
        axis,
        `${axisName}-${iMetric}`
      );
    }

    const dpr = window.devicePixelRatio;
    const widthSrc = Math.round(config.backBufferWidth * dpr);
    const heightSrc = Math.round(config.height * dpr);
    const widthDest = Math.round(config.backBufferWidth);
    const heightDest = Math.round(config.height);

    copyCanvasInto(layerBuffer, config.backBufferCtx, 0, 0, widthSrc, heightSrc, 0, 0, widthDest, heightDest);
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
    axis.extrapolateMissingMetrics = extrapolateMissingStackedAreaValuesEnabled;
  }
};

function resizeLayerBuffer(config) {
  updateCanvasDimensions(layerBuffer, layerBufferCtx, config.backBufferWidth, config.height, config.devicePixelRatio);
}

function renderDataSeries(config, dataSeries, metricMap, scale, isLastSeries, strokeStyle, fillStyle, axis, metricId) {
  const blocks = config.calculateBlocks(dataSeries, axis?.distanceBetweenDatapointsInMillis?.[metricId]);
  for (let i = 0; i < blocks.length; i++) {
    drawBlock(metricMap, config, scale, blocks[i], isLastSeries, strokeStyle, fillStyle);
  }
}

function drawBlock(metricMap, config, scale, block, cutArea, strokeStyle, fillStyle) {
  const firstDataPoint = block[0];
  const lastDataPoint = block[block.length - 1];
  const firstDataPointXPos = config.xScaleBackBuffer.getRange(firstDataPoint[0]);
  const lastDataPointXPos = config.xScaleBackBuffer.getRange(lastDataPoint[0]);

  if (block.length === 1) {
    // a block with a lone data point
    const { xPos, yPos } = getPosition(firstDataPoint, metricMap, config, scale);
    drawCircleWithLine({
      renderingContext: layerBufferCtx,
      config,
      xPos,
      yPos,
      circleStyle: strokeStyle,
      lineStyle: fillStyle
    });
  } else {
    layerBufferCtx.fillStyle = fillStyle;
    layerBufferCtx.strokeStyle = strokeStyle;
    layerBufferCtx.beginPath();
    layerBufferCtx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

    for (let i = 1; i < block.length; i++) {
      const dataPoint = block[i];
      if (!dataPoint) {
        continue;
      }

      const { xPos, yPos } = getPosition(dataPoint, metricMap, config, scale);
      layerBufferCtx.lineTo(xPos, yPos);
    }

    layerBufferCtx.stroke();
    if (cutArea) {
      layerBufferCtx.globalCompositeOperation = 'destination-out';
    }
    layerBufferCtx.lineTo(lastDataPointXPos - 1, config.height - config.timeAxisHeight);
    layerBufferCtx.lineTo(firstDataPointXPos - 1, config.height - config.timeAxisHeight);
    layerBufferCtx.closePath();
    layerBufferCtx.fill();
    layerBufferCtx.globalCompositeOperation = 'source-over';
  }
}

function getPosition(dataPoint, metricMap, config, scale) {
  const time = dataPoint[0];

  let value = dataPoint[1];
  if (metricMap[time]) {
    value = metricMap[time];
    metricMap[time] -= dataPoint[1];
  }
  const xPos = config.xScaleBackBuffer.getRange(time);
  const yPos = scale.getRange(value);
  return { xPos, yPos };
}
