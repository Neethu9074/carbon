import theme from 'in-themes';

export default function axis(config) {
  config.backBufferCtx.fillStyle = theme.lib.colors.N300;
  config.backBufferCtx.beginPath();

  drawTickPositionsForAxis(config.scales.y1);
  drawTickPositionsForAxis(config.scales.y2);

  config.backBufferCtx.fill();

  function drawTickPositionsForAxis(axis) {
    if (!axis) {
      return;
    }

    const tickPositions = axis.tickPositions;
    for (let i = 0; i < tickPositions.length; i++) {
      const tick = tickPositions[i];
      config.backBufferCtx.rect(
        config.scales.xBackBuffer.getRangeFrom(),
        tick.range,
        config.scales.xBackBuffer.getRangeTo() - config.scales.xBackBuffer.getRangeFrom(),
        1
      );
    }
  }
}
