/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
  render: ({ metrics, scale, config, colors100, axis }) => {
    const xScale = config.xScaleBackBuffer;
    const blockSizeMillis = axis.dynamicCalculatedBlockSizeMillis || 1000;

    const chartHeight = scale.getRangeFrom();
    const blockOuterWidth =
      xScale.getRange(xScale.getDomainTo()) - xScale.getRange(xScale.getDomainTo() - blockSizeMillis);
    const blockMargin = Math.min(MAX_BAR_MARGIN_IN_PX, blockOuterWidth / (2 + MIN_BAR_TO_MARGIN_RATION));
    const blockInnerWidth = Math.floor(blockOuterWidth - 2 * blockMargin);
    const barWidth = Math.floor(blockInnerWidth / axis.numOfSeries);

    config.backBufferCtx.save();
    config.backBufferCtx.globalAlpha = 1.0;

    for (let iMetric = 0; iMetric < metrics.length; iMetric++) {
      const dataSeries = metrics[iMetric];
      if (!dataSeries) {
        continue;
      }

      config.backBufferCtx.fillStyle = colors100[iMetric];

      for (let iDataSeries = 0; iDataSeries < dataSeries.length; iDataSeries++) {
        const dataPoint = dataSeries[iDataSeries];
        if (!dataPoint) {
          continue;
        }

        const xPos = xScale.getRange(dataPoint[0]) - blockInnerWidth / 2 + iMetric * barWidth;
        const yPos = scale.getRange(dataPoint[1]);
        const barHeight = Math.max(MIN_BAR_HEIGHT_IN_PX, chartHeight - yPos);
        config.backBufferCtx.fillRect(xPos, chartHeight - barHeight, barWidth, barHeight);
      }
    }

    config.backBufferCtx.restore();
  },

  enrich: (config, axis) => {
    config.addBlockSizeMillisForAxis(axis);
    axis.manualRenderLoop = true;
  }
};
