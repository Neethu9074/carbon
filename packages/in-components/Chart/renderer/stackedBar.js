/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { range, rangeRight } from 'lodash';

import { MAX_BAR_MARGIN_IN_PX, MIN_BAR_HEIGHT_IN_PX, MIN_BAR_TO_MARGIN_RATION } from 'in-components/Chart/renderer/bar';
import { calculateMetricMap } from 'in-components/Chart/renderer/utils';

export default {
  render: ({ metrics, scale, config, colors100, axis }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics);
    }
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;
    const width =
      config.xScaleBackBuffer.getRange(config.xScaleBackBuffer.getDomainTo()) -
      config.xScaleBackBuffer.getRange(config.xScaleBackBuffer.getDomainTo() - blockSizeMillis);
    const barMargin = Math.min(MAX_BAR_MARGIN_IN_PX, width / (2 + MIN_BAR_TO_MARGIN_RATION));
    const barWidth = width - 2 * barMargin;

    const metricIndexes =
      config.metricsConfiguration && config.metricsConfiguration.reverseOrder === true
        ? range(metrics.length)
        : rangeRight(metrics.length);
    metricIndexes.map(iMetric => {
      const isLastSeries = iMetric === metrics.length - 1;
      renderDataSeries(config, metrics[iMetric], metricMap, scale, barWidth, colors100[iMetric], isLastSeries);
    });
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
    config.addBlockSizeMillisForAxis(axis);
  }
};

export function renderDataSeries(config, dataSeries, metricMap, scale, barWidth, color, isLastSeries) {
  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    drawBlock(metricMap, config, scale, block, barWidth, color, isLastSeries);
  }
}

function drawBlock(metricMap, config, scale, block, barWidth, color, isLastSeries) {
  const chartHeight = scale.getRangeFrom();

  config.backBufferCtx.globalAlpha = 1.0;

  const startIndex =
    !config.includeFirstDataPoint && shouldSkipFirstDataPoint(block[0], config.xScaleBackBuffer, barWidth) ? 1 : 0;
  for (let i = startIndex; i < block.length; i++) {
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

    const xPos = config.xScaleBackBuffer.getRange(time) - barWidth / 2;

    const yPos = scale.getRange(value);
    const barHeight = Math.max(MIN_BAR_HEIGHT_IN_PX, chartHeight - yPos);

    config.backBufferCtx.fillStyle = color;
    config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth, barHeight);

    if (!isLastSeries) {
      config.backBufferCtx.fillStyle = '#fff';
      config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth, 1);
    }
  }
}

// For the very first set of blocks, skip the first (which would be half a bar), but for next sets start from 0
// as otherwise full bars are skipped, resulting in a partial graph
export function shouldSkipFirstDataPoint(firstDataPoint, xScale, barWidth) {
  return xScale.getRange(firstDataPoint[0]) - barWidth / 2 < 0;
}
