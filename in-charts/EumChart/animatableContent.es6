export default function createAnimatableContentRenderer(config) {
  return {
    render
  };

  function render() {
    renderAxisContent('y1');
    if (config['y2']) {
      renderAxisContent('y2');
    }
    clearOverflowingAxisContent();
  }

  function clearOverflowingAxisContent() {
    config.ctx.animationScreen.clearRect(
      config.margins.left,
      config.height - config.margins.bottom,
      config.width,
      config.margins.bottom
    );
  }

  function renderAxisContent(axisName) {
    const rollupSize = config.rollup.rollup || 1000;
    const newDataColumns = config.queues[axisName].get();
    const axisContentRenderer = config.axisContentRenderers[axisName];
    axisContentRenderer.processNewDataColumns(newDataColumns, axisName);
    config.dataHolders[axisName].insertSorted(newDataColumns);
    // Subtract config.rollup to ensure that we have smooth animation at the beginning of the chart even
    // when the content is animating.
    config.dataHolders[axisName].expireDataPointsOlderThan(config.scales.x.getDomainFrom() - rollupSize);
    const dataColumns = config.dataHolders[axisName].getDataColumns();
    if (config.processDataColumnsAgain) {
      axisContentRenderer.processNewDataColumns(dataColumns, axisName);
    }
    config.processDataColumnsAgain = false;
    updateScale(dataColumns, axisName);
    axisContentRenderer.render(dataColumns);
  }

  function updateScale(dataColumns, axisName) {
    const axisConfig = config[axisName];
    const scale = config.scales[axisName];
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;

    if (axisConfig.min != null && axisConfig.max != null) {
      max = axisConfig.max;
      min = axisConfig.min;
    } else {
      const getBounds = config.axisContentRenderers[axisName].getBoundsForRow || getBoundsForRow;

      for (let i = 0, len = dataColumns.length; i < len; i++) {
        const column = dataColumns[i];
        const bounds = getBounds(column, axisName);
        max = Math.max(max, bounds[1]);
        min = Math.min(min, bounds[0]);
      }

      if (axisConfig.min != null) {
        min = axisConfig.min;
      }

      if (axisConfig.max != null) {
        max = axisConfig.max;
      }

      const range = max - min;
      if (range === 0) {
        min = min / 2;
        max = max * 2;
      }
    }

    if (min >= max) {
      max = min + 1;
    }

    scale.setDomainFrom(min);
    scale.setDomainTo(max);
  }

  function getBoundsForRow(column, axisName) {
    const activeSeries = config.activeSeries[axisName];
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;

    for (let i = 0, len = column.length; i < len; i++) {
      const point = column[i];

      if (point && activeSeries[i] === true) {
        max = Math.max(max, point[1]);
        min = Math.min(min, point[1]);
      }
    }

    return [min, max];
  }
}
