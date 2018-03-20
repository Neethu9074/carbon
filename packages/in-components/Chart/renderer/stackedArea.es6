export default {
  render: ({ metrics, colors, scale, config, axis }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics);
    }
    for (let iMetric = metrics.length - 1; iMetric >= 0; iMetric--) {
      renderDataSeries(config, colors[iMetric], metrics[iMetric], metricMap, scale);
    }
  },

  enrich: (config, axis) => {
    axis.valuesNeedToBeStacked = true;
    axis.valuesDependOnEachOther = true;
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

function renderDataSeries(config, color, dataSeries, metricMap, scale) {
  config.ctx.beginPath();
  config.ctx.fillStyle = color;

  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    drawBlock(metricMap, config, scale, blocks[i]);
  }
}

function drawBlock(metricMap, config, scale, block) {
  if (block.length === 0) {
    return;
  }

  const firstDataPoint = block[0];
  const lastDataPoint = block[block.length - 1];
  const firstDataPointXPos = config.scales.x.getRange(firstDataPoint[0]);
  const lastDataPointXPos = config.scales.x.getRange(lastDataPoint[0]);

  config.ctx.beginPath();
  config.ctx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

  for (let i = 1; i < block.length; i++) {
    const dataPoint = block[i];
    const time = dataPoint[0];

    let value = dataPoint[1];
    if (metricMap[time]) {
      value = metricMap[time];
      metricMap[time] -= dataPoint[1];
    }
    const xPos = config.scales.x.getRange(time);
    const yPos = scale.getRange(value);
    config.ctx.lineTo(xPos, yPos);
  }

  config.ctx.lineTo(lastDataPointXPos, config.height);
  config.ctx.lineTo(firstDataPointXPos, config.height);
  config.ctx.closePath();
  config.ctx.fill();
}
