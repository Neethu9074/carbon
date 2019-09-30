import { MARGIN_BETWEEN_BARS, MIN_HEIGHT_IN_PX } from 'in-components/Chart/renderer/bar';
import { calculateMetricMap } from 'in-components/Chart/renderer/utils';

export default {
  render: ({ metrics, scale, config, colors100, axis }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics);
    }
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;
    const barWidth =
      config.scales.xBackBuffer.getRange(config.scales.xBackBuffer.getDomainTo()) -
      config.scales.xBackBuffer.getRange(config.scales.xBackBuffer.getDomainTo() - blockSizeMillis);

    for (let iMetric = metrics.length - 1; iMetric >= 0; iMetric--) {
      renderDataSeries(config, metrics[iMetric], metricMap, scale, barWidth, colors100[iMetric]);
    }
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
    config.addBlockSizeMillisForAxis(axis);
  }
};

export function renderDataSeries(config, dataSeries, metricMap, scale, barWidth, color) {
  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    drawBlock(metricMap, config, scale, block, barWidth, color);
  }
}

function drawBlock(metricMap, config, scale, block, barWidth, color) {
  const chartHeight = scale.getRangeFrom();

  config.backBufferCtx.beginPath();
  config.backBufferCtx.globalAlpha = 1.0;
  config.backBufferCtx.fillStyle = color;

  const startIndex = shouldSkipFirstDataPoint(block[0], config.scales.xBackBuffer, barWidth) ? 1 : 0;
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

    const xPos = config.scales.xBackBuffer.getRange(time) - barWidth + MARGIN_BETWEEN_BARS + barWidth / 2;

    // 2px minimum bar height so make them visible
    const yPos = scale.getRange(value);
    const barHeight = Math.max(MIN_HEIGHT_IN_PX, chartHeight - yPos);

    config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth - MARGIN_BETWEEN_BARS * 2, barHeight);
  }

  config.backBufferCtx.fill();
  config.backBufferCtx.closePath();
}

// For the very first set of blocks, skip the first (which would be half a bar), but for next sets start from 0
// as otherwise full bars are skipped, resulting in a partial graph
export function shouldSkipFirstDataPoint(firstDataPoint, xScale, barWidth) {
  return xScale.getRange(firstDataPoint[0]) - barWidth / 2 < 0;
}
