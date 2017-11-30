export function updateCanvasDimensions(canvas, ctx, width, height, devicePixelRatio) {
  if (devicePixelRatio === undefined) {
    devicePixelRatio = window.devicePixelRatio || 1;
  }
  const backingStoreRatio =
    ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio ||
    1;
  const ratio = devicePixelRatio / backingStoreRatio;
  canvas.setAttribute('width', width * ratio);
  canvas.setAttribute('height', height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.scale(ratio, ratio);
  return ratio;
}
