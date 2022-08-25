/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import theme from 'in-themes';

export default function axis(config) {
  const backBufferCtx = config.backBufferCtx;
  backBufferCtx.save();
  backBufferCtx.globalCompositeOperation = 'multiply';

  backBufferCtx.fillStyle = theme.lib.colors.N300;
  backBufferCtx.beginPath();

  drawTickPositionsForAxis(config.scales.y1);
  drawTickPositionsForAxis(config.scales.y2);

  backBufferCtx.fill();
  backBufferCtx.restore();

  function drawTickPositionsForAxis(axis) {
    if (!axis) {
      return;
    }

    const tickPositions = axis.tickPositions;
    for (let i = 0; i < tickPositions.length; i++) {
      const tick = tickPositions[i];
      backBufferCtx.rect(
        config.xScaleBackBuffer.getRangeFrom(),
        tick.range,
        config.xScaleBackBuffer.getRangeTo() - config.xScaleBackBuffer.getRangeFrom(),
        1
      );
    }
  }
}
