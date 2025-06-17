/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Renderer, RenderProps } from 'in-components/Chart/renderer/types';

export const correctionWindowMetricId = 'correctionWindow';

export const correctionOverlay: Renderer<RenderProps> = {
  id: 'correctionOverlay',
  render: ({ config, dataSeries, color }) => {
    const { backBufferCtx, xScaleBackBuffer } = config;
    const height = config.height - config.markerPaneHeight - config.timeAxisHeight;
    backBufferCtx.save();
    for (let i = 0; i < dataSeries.length; i += 2) {
      const [startTimestamp] = dataSeries[i];
      const [endTimestamp] = dataSeries[i + 1];
      const startX = xScaleBackBuffer.getRange(startTimestamp);
      const endX = xScaleBackBuffer.getRange(endTimestamp);

      backBufferCtx.fillStyle = color;
      backBufferCtx.fillRect(startX, config.markerPaneHeight, endX - startX, height);
      backBufferCtx.restore();
    }
  }
};
