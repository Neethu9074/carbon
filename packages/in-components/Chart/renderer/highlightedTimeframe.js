/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default function render(config, highlightedTimeframe) {
  if (!highlightedTimeframe) return null;

  const { backBufferCtx, height: canvasHeight, timeAxisHeight, xScaleBackBuffer } = config;

  const from = Math.max(xScaleBackBuffer.getRangeFrom(), xScaleBackBuffer.getRange(highlightedTimeframe[0]));
  const to = Math.min(xScaleBackBuffer.getRangeTo(), xScaleBackBuffer.getRange(highlightedTimeframe[1]));

  const height = canvasHeight - timeAxisHeight;
  const width = to - from;

  backBufferCtx.beginPath();
  backBufferCtx.rect(from, config.markerPaneHeight, width, height);
  backBufferCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  backBufferCtx.fill();
}
