/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { MIN_BAR_HEIGHT_IN_PX, MAX_BAR_MARGIN_IN_PX, MIN_BAR_TO_MARGIN_RATION } from 'in-components/Chart/renderer/bar';

export default {
  render: ({ axis, dataSeries, color, scale, config }) => {
    const xScale = config.xScaleBackBuffer;
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
