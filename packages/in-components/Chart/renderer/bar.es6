export const MARGIN_BETWEEN_BARS = 1;
export const MIN_HEIGHT_IN_PX = 2;

export default {
  render: ({ axis, dataSeries, color, scale, config }) => {
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;

    const barWidth =
      config.scales.xBackBuffer.getRange(config.scales.xBackBuffer.getDomainTo()) -
      config.scales.xBackBuffer.getRange(config.scales.xBackBuffer.getDomainTo() - blockSizeMillis);

    const chartHeight = scale.getRangeFrom();

    config.backBufferCtx.beginPath();
    config.backBufferCtx.fillStyle = color;

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];

      const xPos = config.scales.xBackBuffer.getRange(dataPoint[0]) - barWidth + MARGIN_BETWEEN_BARS + barWidth / 2;

      // 2px minimum bar height so make them visible
      const yPos = scale.getRange(dataPoint[1]);
      const barHeight = Math.max(MIN_HEIGHT_IN_PX, chartHeight - yPos);

      config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth - MARGIN_BETWEEN_BARS * 2, barHeight);
    }

    config.backBufferCtx.fill();
    config.backBufferCtx.globalAlpha = 1.0;
  },

  enrich: (config, axis) => {
    config.addBlockSizeMillisForAxis(axis);
  }
};
