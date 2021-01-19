/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function updateCanvasDimensions(canvas, ctx, width, height, devicePixelRatio = window.devicePixelRatio) {
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
  canvas.style.height = `${height}px`;

  ctx.scale(ratio, ratio);
  return ratio;
}

export function copyCanvasInto(sourceCanvas, targetContext, sx, sy, sw, sh, dx, dy, dw, dh) {
  if (
    sw === 0 ||
    sh === 0 ||
    dw === 0 ||
    dh === 0 ||
    sourceCanvas.style.width === 0 ||
    sourceCanvas.style.height === 0
  ) {
    return;
  }

  targetContext.clearRect(dx, dy, dw, dh);

  targetContext.drawImage(
    sourceCanvas,

    sx,
    sy,
    sw,
    sh,

    dx,
    dy,
    dw,
    dh
  );
}

export function copyCanvasIntoShort(sourceCanvas, targetContext, dx, dy, dw, dh) {
  if (dw === 0 || dh === 0 || sourceCanvas.style.width === 0 || sourceCanvas.style.height === 0) {
    return;
  }

  targetContext.clearRect(dx, dy, dw, dh);

  targetContext.drawImage(
    sourceCanvas,

    dx,
    dy,
    dw,
    dh
  );
}
