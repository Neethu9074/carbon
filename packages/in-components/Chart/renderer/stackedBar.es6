import { MARGIN_BETWEEN_BARS, MIN_HEIGHT_IN_PX } from 'in-components/Chart/renderer/bar';

export default {
  render: ({ metrics, scale, config, axis }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics);
    }
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;
    const barWidth =
      config.scales.xBackBuffer.getRange(config.scales.xBackBuffer.getDomainTo()) -
      config.scales.xBackBuffer.getRange(config.scales.xBackBuffer.getDomainTo() - blockSizeMillis);

    for (let iMetric = metrics.length - 1; iMetric >= 0; iMetric--) {
      renderDataSeries(config, axis.colors100[iMetric], metrics[iMetric], metricMap, scale, barWidth);
    }
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
    config.addBlockSizeMillisForAxis(axis);
  }
};

function calculateMetricMap(metrics) {
  const metricMap = {};

  for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
    const dataSeries = metrics[iMetric];

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      const previousValue = iMetric > 0 && metricMap[dataPoint[0]] != null ? metricMap[dataPoint[0]] : 0;
      const value = dataPoint[1] + previousValue;
      metricMap[dataPoint[0]] = value;
    }
  }
  return metricMap;
}

function renderDataSeries(config, color, dataSeries, metricMap, scale, barWidth) {
  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    drawBlock(metricMap, config, scale, blocks[i], i, barWidth, color);
  }
}

function drawBlock(metricMap, config, scale, block, blockIndex, barWidth, color) {
  if (block.length === 0) {
    return;
  }

  const chartHeight = scale.getRangeFrom();

  config.backBufferCtx.beginPath();
  config.backBufferCtx.globalAlpha = 1.0;
  config.backBufferCtx.fillStyle = color;

  // For the very first set of blocks, skip the first (which would be half a bar), but for next sets start from 0
  // as otherwise full bars are skipped, resulting in a partial graph
  const startIndex = blockIndex === 0 ? 1 : 0;
  for (let i = startIndex; i < block.length; i++) {
    const dataPoint = block[i];
    const time = dataPoint[0];

    let value = dataPoint[1];
    if (metricMap[time]) {
      value = metricMap[time];
      metricMap[time] -= dataPoint[1];
    }

    const xPos = config.scales.xBackBuffer.getRange(time) - barWidth + MARGIN_BETWEEN_BARS + barWidth / 2;

    // 2px minimum bar height so make them visible
    const yPos = scale.getRange(value);
    const barHeight = Math.max(MIN_HEIGHT_IN_PX, chartHeight - yPos);

    config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth - MARGIN_BETWEEN_BARS * 2, barHeight);
  }

  config.backBufferCtx.fill();
  config.backBufferCtx.closePath();
}
