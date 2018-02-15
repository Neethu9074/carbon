const MARGIN_BETWEEN_BARS = 1;
const MIN_HEIGHT_IN_PX = 2;

export default {
  render: ({ axis, dataSeries, color, scale, config }) => {
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;

    const barWidth =
      config.scales.x.getRange(config.scales.x.getDomainTo()) -
      config.scales.x.getRange(config.scales.x.getDomainTo() - blockSizeMillis);

    const chartHeight = scale.getRangeFrom();

    config.ctx.beginPath();
    config.ctx.globalAlpha = 0.3;
    config.ctx.fillStyle = color;

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];

      const xPos = config.scales.x.getRange(dataPoint[0]) - barWidth + MARGIN_BETWEEN_BARS;

      // 2px minimum bar height so make them visible
      const yPos = scale.getRange(dataPoint[1]);
      const barHeight = Math.max(MIN_HEIGHT_IN_PX, chartHeight - yPos);

      config.ctx.fillRect(xPos, chartHeight - barHeight, barWidth - MARGIN_BETWEEN_BARS * 2, barHeight);
    }

    config.ctx.fill();
    config.ctx.globalAlpha = 1.0;
  },

  enrich: (config, axis) => {
    config.addBlockSizeMillisForAxis(axis);
  }
};
