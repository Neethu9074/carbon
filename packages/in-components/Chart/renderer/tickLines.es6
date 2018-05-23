import theme from 'in-themes';

export default function axis(config) {
  config.ctx.fillStyle = theme.lib.colors.N300;
  config.ctx.beginPath();

  drawTickPositionsForAxis(config.scales.y1);
  drawTickPositionsForAxis(config.scales.y2);

  config.ctx.fill();

  function drawTickPositionsForAxis(axis) {
    if (!axis) {
      return;
    }

    const tickPositions = axis.tickPositions;
    for (let i = 0; i < tickPositions.length; i++) {
      const tick = tickPositions[i];
      config.ctx.rect(
        config.scales.x.getRangeFrom(),
        tick.range,
        config.scales.x.getRangeTo() - config.scales.x.getRangeFrom(),
        1
      );
    }
  }
}
