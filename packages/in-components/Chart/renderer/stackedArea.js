/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { calculateMetricMap } from 'in-components/Chart/renderer/utils';

export default {
  render: ({ metrics, colors, colors100, scale, config, axis }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics);
    }
    for (let iMetric = metrics.length - 1; iMetric >= 0; iMetric--) {
      renderDataSeries(config, colors[iMetric], colors100[iMetric], metrics[iMetric], metricMap, scale);
    }
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
  }
};

function renderDataSeries(config, color, borderColor, dataSeries, metricMap, scale) {
  config.backBufferCtx.beginPath();
  config.backBufferCtx.fillStyle = color;

  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    drawBlock(metricMap, config, scale, blocks[i], borderColor);
  }
}

function drawBlock(metricMap, config, scale, block, borderColor) {
  const firstDataPoint = block[0];
  const lastDataPoint = block[block.length - 1];
  const firstDataPointXPos = config.xScaleBackBuffer.getRange(firstDataPoint[0]);
  const lastDataPointXPos = config.xScaleBackBuffer.getRange(lastDataPoint[0]);

  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

  for (let i = 1; i < block.length; i++) {
    const dataPoint = block[i];
    if (!dataPoint) {
      continue;
    }

    const time = dataPoint[0];

    let value = dataPoint[1];
    if (metricMap[time]) {
      value = metricMap[time];
      metricMap[time] -= dataPoint[1];
    }
    const xPos = config.xScaleBackBuffer.getRange(time);
    const yPos = scale.getRange(value);
    config.backBufferCtx.lineTo(xPos, yPos);
  }

  config.backBufferCtx.strokeStyle = borderColor;
  config.backBufferCtx.lineWidth = 2;
  config.backBufferCtx.stroke();
  config.backBufferCtx.lineTo(lastDataPointXPos, config.height - config.timeAxisHeight);
  config.backBufferCtx.lineTo(firstDataPointXPos, config.height - config.timeAxisHeight);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
}
