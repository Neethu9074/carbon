export default function render(config, highlightedTimeframe) {
  if (!highlightedTimeframe) return null;

  const {
    scales: { xBackBuffer: xScale },
    backBufferCtx,
    height: canvasHeight,
    timeAxisHeight
  } = config;

  const from = Math.max(xScale.getRangeFrom(), xScale.getRange(highlightedTimeframe[0]));
  const to = Math.min(xScale.getRangeTo(), xScale.getRange(highlightedTimeframe[1]));

  const height = canvasHeight - timeAxisHeight;
  const width = to - from;

  backBufferCtx.globalCompositeOperation = 'multiply';
  backBufferCtx.beginPath();
  backBufferCtx.rect(from, 0, width, height);
  backBufferCtx.fillStyle = 'rgba(75, 165, 210, 0.2)';
  backBufferCtx.fill();
  backBufferCtx.globalCompositeOperation = 'source-over';
}
