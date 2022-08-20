/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ANIMATION_DURATION } from 'in-components/Chart/Configuration';
import { updateCanvasDimensions } from 'in-components/Chart/canvas';
import RenderScheduler from 'in-components/Chart/RenderScheduler';
import { createCanvas } from 'in-components/Chart/canvasHelper';
import { copyCanvasInto } from 'in-components/Chart/canvas';

export default class DoubleBufferRenderScheduler extends RenderScheduler {
  constructor(frontBufferCanvas, callbackHolder) {
    super(callbackHolder);

    this.initBuffer(frontBufferCanvas);
  }

  initBuffer(frontBufferCanvas) {
    this.bufferOffsetInPx = 0;
    this.backBufferWidth = 0;
    this.frontBufferWidth = 0;
    this.bufferHeight = 0;

    this.backBufferCanvas = createCanvas();
    this.backBufferCtx = this.backBufferCanvas.getContext('2d');
    this.frontBufferCanvas = frontBufferCanvas;
    this.frontBufferCtx = frontBufferCanvas.getContext('2d');
  }

  update(timeConfig, width, height) {
    const shouldResizeFrontBuffer = this.frontBufferWidth !== width || this.bufferHeight !== height;
    this.frontBufferWidth = width;
    this.bufferHeight = height;

    const fullDomain = timeConfig.windowSize;

    const bufferOffsetInPx = this.frontBufferWidth * ((timeConfig.autoRefresh ? ANIMATION_DURATION : 0) / fullDomain);
    // we need to round the pixels to full values because some browser APIs cannot handle floats here.
    // because rounding manipulates the calculation we need to add the error created by the rounding to the animation time
    // to avoid chart hoppings.
    //
    // Important: Please make sure to test the changes you make herein in Safari in 1h time window live mode!
    const bufferOffsetInPxRounded = Math.ceil(bufferOffsetInPx);

    this.bufferOffsetInPx = bufferOffsetInPx;
    this.backBufferWidth = this.frontBufferWidth + bufferOffsetInPxRounded;

    this.updateBuffer(shouldResizeFrontBuffer);

    super.update(timeConfig, width);
  }

  updateBuffer(shouldResizeFrontBuffer) {
    updateCanvasDimensions(this.backBufferCanvas, this.backBufferCtx, this.backBufferWidth, this.bufferHeight);
    if (shouldResizeFrontBuffer) {
      updateCanvasDimensions(this.frontBufferCanvas, this.frontBufferCtx, this.frontBufferWidth, this.bufferHeight);
    }
  }

  atomicRender() {
    super.atomicRender();
    this.drawBackBufferToFrontBuffer();
  }

  onProgress(progress) {
    this.drawBackBufferToFrontBuffer(progress);
  }

  drawBackBufferToFrontBuffer(progress = 1) {
    progress = Math.min(1, progress);
    const dpr = window.devicePixelRatio;

    copyCanvasInto(
      this.backBufferCanvas,
      this.frontBufferCtx,
      Math.round(progress * this.bufferOffsetInPx * dpr),
      0,
      Math.round(this.frontBufferWidth * dpr),
      Math.round(this.bufferHeight * dpr),
      0,
      0,
      this.frontBufferWidth,
      this.bufferHeight
    );
  }

  getRenderProps() {
    return {
      ...super.getRenderProps(),
      backBufferCtx: this.backBufferCtx,
      backBufferWidth: this.backBufferWidth,
      bufferOffsetInPx: this.bufferOffsetInPx,
      bufferHeight: this.bufferHeight
    };
  }
}
