export default function createStackedAreaContentRenderer(config) {
  let ctx;
  let x;

  return {
    render,
    prepareRendering
  };

  function prepareRendering() {
    ctx = config.ctx.animationBuffer;
    x = config.scales.x;
  }

  function render(anomalyTimestampMap) {
    const lineWidth = Math.max(
      1,
      x.getRange(x.getDomainFrom() + config.forecastConfig.rollup.rollup) - x.getRange(x.getDomainFrom())
    );

    ctx.beginPath();
    Object.keys(anomalyTimestampMap).forEach(timestamp => {
      const xToRender = x.getRange(timestamp);
      ctx.fillStyle = '#ff4229';
      ctx.globalAlpha = 0.075;
      ctx.rect(xToRender - lineWidth / 2, 0, lineWidth, config.height);
    });
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}
