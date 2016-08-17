export default function createAnimatableContentRenderer(config) {
  const ctx = config.ctx.animationBuffer;

  return {
    render
  };

  function render() {
    renderXAxis();

    renderAxisContent('y1');
    if (config.y2) {
      renderAxisContent('y2');
    }
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


  function renderAxisContent(axisName) {
    const newDataColumns = config.queues[axisName].get();
    const axisContentRenderer = config.axisContentRenderers[axisName];
    axisContentRenderer.processNewDataColumns(newDataColumns);
    config.dataHolders[axisName].insertSorted(newDataColumns);
    config.dataHolders[axisName].expireDataPointsOlderThan(config.scales.x.getDomainFrom());
    const dataColumns = config.dataHolders[axisName].getDataColumns();
    updateScale(dataColumns, axisName);
    axisContentRenderer.render(dataColumns);
  }


  function updateScale(dataColumns, axisName) {
    const axisConfig = config[axisName];
    const scale = config.scales[axisName];
    let max = Number.MAX_VALUE * -1;
    let min = Number.MAX_VALUE;

    if (axisConfig.min == null && axisConfig.max == null) {
      const getBounds = config.axisContentRenderers[axisName].getBoundsForRow || getBoundsForRow;

      for (let i = 0, len = dataColumns.length; i < len; i++) {
        const column = dataColumns[i];
        const bounds = getBounds(column);
        max = Math.max(max, bounds[1]);
        min = Math.min(min, bounds[0]);
      }

      const range = max - min;
      if (range === 0) {
        // add 10% to generate a chartable value range
        min = min * 0.9;
        max = max * 1.1;
      } else {
        min -= range * 0.05;
        max += range * 0.05;
      }
    } else {
      max = axisConfig.max;
      min = axisConfig.min;
    }

    if (min >= max) {
      max = min + 1;
    }

    scale.setDomainFrom(min);
    scale.setDomainTo(max);
  }
}


function getBoundsForRow(column) {
  let max = Number.MAX_VALUE * -1;
  let min = Number.MAX_VALUE;

  for (let i = 0, len = column.length; i < len; i++) {
    const point = column[i];

    if (point) {
      max = Math.max(max, point[1]);
      min = Math.min(min, point[1]);
    }
  }

  return [min, max];
}
