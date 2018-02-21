export default function axis(config) {
  config.ctx.beginPath();
  config.ctx.fillStyle = '#ddd';

  drawXAxis();

  config.ctx.fill();

  function drawXAxis() {
    config.ctx.rect(
      config.scales.x.getRangeFrom(),
      config.scales.y1.getRangeFrom(),
      config.scales.x.getRangeTo() - config.scales.x.getRangeFrom() + 1,
      1
    );
  }
}
