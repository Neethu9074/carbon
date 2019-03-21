export default {
  render: ({ metrics, colors, colors100, scale, config, axis }) => {
    let metricMap = {};
    if (!axis.calculateStackDifferences) {
      metricMap = calculateMetricMap(metrics);
    }

    const metricBaseLine = metrics[0];
    for (let iMetric = metrics.length - 1; iMetric > 0; iMetric--) {
      renderDataSeries(config, colors[iMetric], colors100[iMetric], metrics[iMetric], metricMap, metricBaseLine, scale);
    }

    drawMetricBaseLine(config, colors100[0], scale, metrics[0]);
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

function renderDataSeries(config, color, borderColor, dataSeries, metricMap, metricBaseLine, scale) {
  config.backBufferCtx.beginPath();
  config.backBufferCtx.fillStyle = color;

  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    drawIntegralBlock(metricMap, config, scale, blocks[i], metricBaseLine, borderColor);
  }
}

function drawIntegralBlock(metricMap, config, scale, block, metricBaseLine, borderColor) {
  const firstDataPoint = block[0];
  const firstDataPointXPos = config.scales.xBackBuffer.getRange(firstDataPoint[0]);

  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(firstDataPointXPos, scale.getRange(firstDataPoint[1]));

  for (let i = 0; i < block.length; i++) {
    const dataPoint = block[i];
    const time = dataPoint[0];

    let value = dataPoint[1];
    if (metricMap[time]) {
      value = metricMap[time];
      metricMap[time] -= dataPoint[1];
    }
    const xPos = config.scales.xBackBuffer.getRange(time);
    const yPos = scale.getRange(value);
    config.backBufferCtx.lineTo(xPos, yPos);
  }

  config.backBufferCtx.strokeStyle = borderColor;
  config.backBufferCtx.lineWidth = 2;
  config.backBufferCtx.stroke();

  for (let i = metricBaseLine.length - 1; i >= 0; i--) {
    const dataPoint = metricBaseLine[i];
    const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]);
    const yPos = scale.getRange(dataPoint[1]);
    if (i === metricBaseLine.length - 1) {
      config.backBufferCtx.lineTo(xPos, yPos);
    } else {
      config.backBufferCtx.lineTo(xPos, yPos);
    }
  }

  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
}

function drawMetricBaseLine(config, color, scale, dataSeries) {
  const blocks = config.calculateBlocks(dataSeries);
  for (let i = 0; i < blocks.length; i++) {
    config.backBufferCtx.beginPath();
    config.backBufferCtx.fillStyle = color;

    const block = blocks[i];

    for (let i2 = 0; i2 < block.length; i2++) {
      const dataPoint = block[i2];
      const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]);
      const yPos = scale.getRange(dataPoint[1]);

      if (i2 === 0) {
        config.backBufferCtx.moveTo(xPos, yPos);
      } else {
        config.backBufferCtx.lineTo(xPos, yPos);
      }
    }

    config.backBufferCtx.strokeStyle = color;
    config.backBufferCtx.lineWidth = 1;
    config.backBufferCtx.stroke();
    config.backBufferCtx.closePath();
  }
}
