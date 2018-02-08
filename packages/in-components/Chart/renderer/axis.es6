export default function axis(config) {
  config.ctx.beginPath();
  config.ctx.fillStyle = '#ddd';

  drawXAxis();
  drawLeftYAxis();
  drawRightYAxis();

  config.ctx.fill();

  function drawXAxis() {
    config.ctx.rect(
      config.scales.x.getRangeFrom(),
      config.scales.y1.getRangeFrom(),
      config.scales.x.getRangeTo() - config.scales.x.getRangeFrom() + 1,
      1
    );
  }

  function drawLeftYAxis() {
    config.ctx.rect(
      config.scales.x.getRangeFrom(),
      config.scales.y1.getRangeTo(),
      1,
      config.scales.y1.getRangeFrom() - config.scales.y1.getRangeTo()
    );
  }

  function drawRightYAxis() {
    if (!config.y2) {
      return;
    }

    config.ctx.rect(
      config.scales.x.getRangeTo() - 1,
      config.scales.y2.getRangeTo(),
      1,
      config.scales.y2.getRangeFrom() - config.scales.y2.getRangeTo()
    );
  }
}
