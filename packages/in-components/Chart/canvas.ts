/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function updateCanvasDimensions(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  devicePixelRatio: number = window.devicePixelRatio
) {
  canvas.setAttribute('width', String(width * devicePixelRatio));
  canvas.setAttribute('height', String(height * devicePixelRatio));
  canvas.style.height = `${height}px`;

  ctx.scale(devicePixelRatio, devicePixelRatio);
  return devicePixelRatio;
}

export function copyCanvasInto(
  sourceCanvas: HTMLCanvasElement,
  targetContext: CanvasRenderingContext2D,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  if (
    sw === 0 ||
    sh === 0 ||
    dw === 0 ||
    dh === 0 ||
    sourceCanvas.style.width === '0' ||
    sourceCanvas.style.height === '0'
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

export function copyCanvasIntoShort(
  sourceCanvas: HTMLCanvasElement,
  targetContext: CanvasRenderingContext2D,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  if (dw === 0 || dh === 0 || sourceCanvas.style.width === '0' || sourceCanvas.style.height === '0') {
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
