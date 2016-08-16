export default function createAnimatableContentRenderer(config) {
  const ctx = config.ctx.animationBuffer;

  return {
    render
  };

  function render() {
    renderXAxis();
  }

  function renderXAxis() {
    const ticks = getXTickPositions();
    const formatting = config.xAxisFormattingConfig;
    ctx.beginPath();
    ctx.font = '0.625rem "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
    ctx.fillStyle = '#2d4048';
    ctx.textAlign = 'center';

    for (let i = 0, len = ticks.length; i < len; i++) {
      const tick = ticks[i];
      ctx.rect(tick.range, config.bounds.bottom, 1, 5);

      ctx.fillStyle = '#2d4048';
      ctx.fillText(formatting.formatter(tick.domain), tick.range, config.bounds.bottom + 18);
    }

    ctx.fillStyle = '#ddd';
    ctx.fill();
  }


  function getXTickPositions() {
    const formatting = config.xAxisFormattingConfig;
    const x = config.scales.bufferX;
    const ticks = [];
    const width = x.getRangeTo();

    let lastTickDomain = formatting.ceilToNearestStep(x.getDomainFrom());
    let lastTickRange = x.getRange(lastTickDomain);

    while (lastTickRange <= width) {
      ticks.push({
        range: lastTickRange,
        domain: lastTickDomain
      });

      lastTickDomain += formatting.stepSize;
      lastTickRange = x.getRange(lastTickDomain);
    }

    return ticks;
  }

}
