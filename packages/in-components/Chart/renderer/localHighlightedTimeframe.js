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
  backBufferCtx.fillStyle = 'rgba(75, 165, 210, 0.2)';
  backBufferCtx.fill();
  backBufferCtx.globalCompositeOperation = 'source-over';
}
