export function copyCanvasInto(from, to, config, clearTarget = true) {
  if (clearTarget) {
    to.clearRect(0, 0, config.width, config.height);
  }

  // copy the result into our original canvas
  const dpr = config.devicePixelRatio;
  const x = config.scales.bufferX.getRange(config.scales.x.getDomainFrom()) - config.scales.bufferX.getRangeFrom();

  to.drawImage(
    from,
    config.margins.left * dpr + x * dpr,
    config.margins.top * dpr,
    config.width * dpr - config.margins.right * dpr - config.margins.left * dpr,
    config.height * dpr - config.margins.top * dpr,
    config.margins.left,
    config.margins.top,
    config.width - config.margins.right - config.margins.left,
    config.height - config.margins.top
  );
}
