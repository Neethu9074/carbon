import { formatTime, formatDateShort } from 'in-services/formatters/date';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import { getAxisTickPositions } from 'in-charts/timeAxis';

const axisFontColor = '#2d4048';
const softerAxisFontColor = '#8c969a';
// Be warned (ben @ 2016-10-04): Safari 10 cannot use font sizes in rem with varying
// text alignments. This used to work with Safari 9 (and all other browsers).
const axisFont = '10px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
const smallerAxisFont = '9px "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif';
const axisTickColor = '#ddd';

export default function createAnimatableContentRenderer(config) {
  const animationCtx = config.ctx.animationBuffer;
  const staticCtx = config.ctx.staticScreen;

  return {
    render
  };

  function render() {
    const shouldRenderY1 = doesAxisNeedToBeRendered('y1');
    const shouldRenderY2 = doesAxisNeedToBeRendered('y2');

    if (shouldRenderY1) {
      renderAxisContent('y1');
    }
    if (shouldRenderY2) {
      renderAxisContent('y2');
    }

    clearOverflowingAxisContent();

    // render after content since the content is updating the y scales
    if (!config.withoutAxis) {
      if (shouldRenderY1) {
        renderYAxis('y1');
      }
      if (shouldRenderY2) {
        renderYAxis('y2');
      }

      renderXAxis();
    }
  }

  function doesAxisNeedToBeRendered(axisName) {
    if (!config[axisName]) {
      return false;
    } else if (!config.hasActiveFilters) {
      return true;
    }

    const activeSeries = config.activeSeries[axisName];
    const keys = Object.keys(activeSeries);
    for (let i = 0, len = keys.length; i < len; i++) {
      if (activeSeries[keys[i]] === true) {
        return true;
      }
    }

    return false;
  }

  function clearOverflowingAxisContent() {
    animationCtx.clearRect(
      config.margins.left,
      config.height - config.margins.bottom,
      config.width,
      config.margins.bottom
    );
  }

  function renderXAxis() {
    const ticks = getXTickPositions();
    animationCtx.beginPath();
    animationCtx.font = axisFont;
    animationCtx.fillStyle = axisFontColor;
    animationCtx.textAlign = 'center';

    for (let i = 0, len = ticks.length; i < len; i++) {
      const tick = ticks[i];
      animationCtx.rect(tick.range, config.bounds.bottom, 1, 5);

      animationCtx.font = axisFont;
      animationCtx.fillStyle = axisFontColor;
      animationCtx.fillText(formatTime(tick.domain), tick.range, config.bounds.bottom + 17);
      animationCtx.font = smallerAxisFont;
      animationCtx.fillStyle = softerAxisFontColor;
      animationCtx.fillText(formatDateShort(tick.domain), tick.range, config.bounds.bottom + 28);
    }

    animationCtx.fillStyle = axisTickColor;
    animationCtx.fill();
  }

  function getXTickPositions() {
    const formatting = config.xAxisFormattingConfig;
    const x = config.scales.bufferX;
    const ticks = [];
    const width = x.getRangeTo();

    let previousTickRange = Number.NEGATIVE_INFINITY;
    let lastTickDomain = formatting.ceilToNearestStep(x.getDomainFrom());
    let lastTickRange = x.getRange(lastTickDomain);

    while (lastTickRange <= width) {
      if (previousTickRange + config.xAxisFormattingConfig.expectLabelWidth < lastTickRange) {
        ticks.push({
          range: lastTickRange,
          domain: lastTickDomain
        });
        previousTickRange = lastTickRange;
      }

      lastTickDomain += formatting.stepSize;
      lastTickRange = x.getRange(lastTickDomain);
    }

    return ticks;
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

  function renderYAxis(axisName) {
    const scale = config.scales[axisName];
    const formatter = (config[axisName].formatter && config[axisName].formatter[0]) || twoDecimalPlaces;

    const ticks = getAxisTickPositions(scale, { formatter });

    const isLeftAxis = axisName === 'y1';
    const tickX = isLeftAxis ? config.bounds.left - 5 : config.bounds.right;
    const textX = isLeftAxis ? config.bounds.left - 10 : config.bounds.right + 10;

    staticCtx.beginPath();
    staticCtx.font = axisFont;
    staticCtx.fillStyle = axisFontColor;
    staticCtx.textBaseline = 'top';

    if (isLeftAxis) {
      staticCtx.textAlign = 'right';
    } else {
      staticCtx.textAlign = 'left';
    }

    for (let i = 0, len = ticks.length; i < len; i++) {
      const tick = ticks[i];
      staticCtx.rect(tickX, tick.range, 5, 1);
      staticCtx.fillStyle = axisFontColor;
      staticCtx.fillText(formatter(tick.domain), textX, tick.range - 4);
    }

    staticCtx.fillStyle = axisTickColor;
    staticCtx.fill();
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
