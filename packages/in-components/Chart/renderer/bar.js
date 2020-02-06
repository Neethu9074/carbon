/**
 * Fixed minimum bar height so make them visible and distinguishable from missing data.
 */
export const MIN_BAR_HEIGHT_IN_PX = 2;

/**
 * Maximum default margin, which can be lower due to {@link MIN_BAR_TO_MARGIN_RATION} to ensure the bar is still clearly
 * visible. The value is only a single-sided margin; hence the actual spacing between two bars is twice this value.
 */
export const MAX_BAR_MARGIN_IN_PX = 1;

/**
 * Minimum ratio of a bar-width to single-side margin, to ensure that the bars are always clearly visible even in
 * extreme cases, such as fine granularity with large time frames, by guaranteeing that the bar width is always wider
 * than the single-side margin by the given factor.
 */
export const MIN_BAR_TO_MARGIN_RATION = 8;

export default {
  render: ({ axis, dataSeries, color, scale, config }) => {
    const xScale = config.scales.xBackBuffer;
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;

    const width = xScale.getRange(xScale.getDomainTo()) - xScale.getRange(xScale.getDomainTo() - blockSizeMillis);
    const barMargin = Math.min(MAX_BAR_MARGIN_IN_PX, width / (2 + MIN_BAR_TO_MARGIN_RATION));
    const barWidth = width - 2 * barMargin;

    const chartHeight = scale.getRangeFrom();

    config.backBufferCtx.beginPath();
    config.backBufferCtx.fillStyle = color;

    for (let i = 0; i < dataSeries.length; i++) {
      const dataPoint = dataSeries[i];
      if (!dataPoint) {
        continue;
      }

      const xPos = xScale.getRange(dataPoint[0]) - barWidth / 2;

      const yPos = scale.getRange(dataPoint[1]);
      const barHeight = Math.max(MIN_BAR_HEIGHT_IN_PX, chartHeight - yPos);

      config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth, barHeight);
    }

    config.backBufferCtx.fill();
    config.backBufferCtx.globalAlpha = 1.0;
  },

  enrich: (config, axis) => {
    config.addBlockSizeMillisForAxis(axis);
  }
};
