/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { extrapolateMissingStackedAreaValuesEnabled } from 'in-services/featureFlags';
import { calculateMetricMap } from 'in-components/Chart/renderer/utils';
import { drawCircleWithLine } from './utils';

export default {
  render: ({ metrics, colors, colors100, scale, config, axis, axisName }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics, axis.extrapolateMissingMetrics);
    }
    for (let iMetric = metrics.length - 1; iMetric >= 0; iMetric--) {
      renderDataSeries(
        config,
        colors[iMetric],
        colors100[iMetric],
        metrics[iMetric],
        metricMap,
        scale,
        axis,
        `${axisName}-${iMetric}`
      );
    }
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
    axis.extrapolateMissingMetrics = extrapolateMissingStackedAreaValuesEnabled;
  }
};

function renderDataSeries(config, fillStyle, strokeStyle, dataSeries, metricMap, scale, axis, metricId) {
  config.backBufferCtx.beginPath();

  const blocks = config.calculateBlocks(dataSeries, axis?.distanceBetweenDatapointsInMillis?.[metricId]);
  for (let i = 0; i < blocks.length; i++) {
    drawBlock(metricMap, config, scale, blocks[i], fillStyle, strokeStyle);
  }
}

function drawBlock(metricMap, config, scale, block, fillStyle, strokeStyle) {
  const firstDataPoint = block[0];
  const lastDataPoint = block[block.length - 1];
  const firstDataPointXPos = config.xScaleBackBuffer.getRange(firstDataPoint[0]);
  const lastDataPointXPos = config.xScaleBackBuffer.getRange(lastDataPoint[0]);

  if (block.length === 1) {
    // a block with a lone data point
    const { xPos, yPos } = getPosition(firstDataPoint, metricMap, config, scale);
    drawCircleWithLine({
      renderingContext: config.backBufferCtx,
      config,
      xPos,
      yPos,
      circleStyle: strokeStyle,
      lineStyle: fillStyle
    });
  } else {
    config.backBufferCtx.fillStyle = fillStyle;
    config.backBufferCtx.beginPath();
    config.backBufferCtx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

    for (let i = 0; i < block.length; i++) {
      const dataPoint = block[i];
      if (!dataPoint) {
        continue;
      }

      const { xPos, yPos } = getPosition(dataPoint, metricMap, config, scale);
      if (i === 0) {
        config.backBufferCtx.moveTo(xPos, yPos);
      } else {
        config.backBufferCtx.lineTo(xPos, yPos);
      }
    }

    config.backBufferCtx.strokeStyle = strokeStyle;
    config.backBufferCtx.lineWidth = 2;
    config.backBufferCtx.stroke();
    config.backBufferCtx.lineTo(lastDataPointXPos, config.height - config.timeAxisHeight);
    config.backBufferCtx.lineTo(firstDataPointXPos, config.height - config.timeAxisHeight);
    config.backBufferCtx.closePath();
    config.backBufferCtx.fill();
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
