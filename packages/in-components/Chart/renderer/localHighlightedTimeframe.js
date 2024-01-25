/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { chartSelection } from 'in-themes/chartColors';

export default function render(config, highlightedTimeframe) {
  if (!highlightedTimeframe) return null;

  const { xScaleBackBuffer, backBufferCtx, height: canvasHeight, timeAxisHeight } = config;

  const from = Math.max(xScaleBackBuffer.getRangeFrom(), xScaleBackBuffer.getRange(highlightedTimeframe[0]));
  const to = Math.min(xScaleBackBuffer.getRangeTo(), xScaleBackBuffer.getRange(highlightedTimeframe[1]));

  const height = canvasHeight - timeAxisHeight;
  const width = to - from;

  backBufferCtx.globalCompositeOperation = 'multiply';
  backBufferCtx.beginPath();
  backBufferCtx.rect(from, config.markerPaneHeight, width, height);
  backBufferCtx.fillStyle = chartSelection;
  backBufferCtx.fill();
  backBufferCtx.globalCompositeOperation = 'source-over';
}
