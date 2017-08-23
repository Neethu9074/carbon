import { copyCanvasInto, drawPoint } from 'in-charts/Chart/buffer';

export default function createLineContentRenderer({ axisName, config }) {
  let ctx = config.ctx.animationBuffer;
  let xDomainOffset = 0;

  const x = config.scales.x;
  const y = config.scales[axisName];
  const axis = config[axisName];
  const colors = axis.colors;
  const activeSeries = config.activeSeries[axisName];

  return {
    requireExistenceInAllSeries: false,
    processNewDataColumns() {},
    prepareRendering,
    render,
    renderForecasts,
    renderAnomalies
  };

  function prepareRendering() {
    xDomainOffset = 0;
    if (axis.aggregation) {
      xDomainOffset -= axis.dynamicCalculatedBlockSizeMillis / 2;
    }
  }

  function renderForecasts(dataColumns) {
    const forecastConfig = axis.forecastConfig;
    const numberOfForecasts = forecastConfig.metrics.length;
    for (let forecastIndex = 0; forecastIndex < numberOfForecasts; forecastIndex++) {
      const metricConfig = forecastConfig.metrics[forecastIndex];
      const metricSeriesIndex = metricConfig.indexInMetrics;
      if (activeSeries[metricSeriesIndex] === false) {
        continue;
      }

      // the series is garuanteed twice the size as the forecast metrics (low, high)
      const seriesIndex = forecastIndex * 2;
      renderArea(false, dataColumns, seriesIndex + 1, xDomainOffset);
      renderArea(true, dataColumns, seriesIndex, xDomainOffset);
    }
  }

  function renderArea(isForecastLow, dataColumns, seriesIndex, xDomainOffset) {
    const color = isForecastLow ? '#fff' : '#e5e5e5';
    ctx.beginPath();
    let lastX = 0;
    let lastY = 0;
    let firstX = null;
    let firstY = null;
    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex]; //[0: time, 1: value, time:time]

      // existense of data points in all rows is not guaranteed - skip column for this series
      if (!dataRow) {
        continue;
      }

      const xToRender = x.getRange(dataRow[0] + xDomainOffset);
      const yToRender = y.getRange(dataRow[1]);

      lastX = xToRender;
      lastY = yToRender;
      if (firstX === null) {
        firstX = xToRender;
        firstY = yToRender;
      }
      ctx.lineTo(xToRender, yToRender);
    }

    // to erase subpixel lines, we have to strech the white area by 1px in width to overdraw it.
    if (isForecastLow) {
      ctx.lineTo(lastX + 1, lastY);
      ctx.lineTo(lastX + 1, y.getRangeFrom());
      ctx.lineTo(firstX - 1, y.getRangeFrom());
      ctx.lineTo(firstX - 1, firstY);
    } else {
      ctx.lineTo(lastX, y.getRangeFrom());
      ctx.lineTo(firstX, y.getRangeFrom());
    }

    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function renderAnomalies(metricDataColumns, forecastDataColumns) {
    ctx = config.forecastConfig.anomaliesMaskCanvasContext;
    ctx.clearRect(0, 0, config.width, config.height);

    const forecastConfig = axis.forecastConfig;
    const numberOfForecasts = forecastConfig.metrics.length;

    for (let forecastIndex = 0; forecastIndex < numberOfForecasts; forecastIndex++) {
      const metricConfig = forecastConfig.metrics[forecastIndex];
      const metricSeriesIndex = metricConfig.indexInMetrics;
      if (activeSeries[metricSeriesIndex] === false) {
        continue;
      }

      // the series is garuanteed twice the size as the forecast metrics (low, high)
      const seriesIndex = forecastIndex * 2;

      ctx.globalCompositeOperation = 'source-over';
      renderArea(false, forecastDataColumns, seriesIndex + 1, xDomainOffset);

      ctx.globalCompositeOperation = 'xor';
      renderArea(true, forecastDataColumns, seriesIndex, xDomainOffset);

      ctx.globalCompositeOperation = 'source-out';
      renderLine(metricDataColumns, metricSeriesIndex, {
        xDomainOffset,
        color: '#ff4229',
        renderDots: false,
        lineWidth: 4
      });

      // restore default operation
      ctx.globalCompositeOperation = 'source-over';
    }

    copyCanvasInto(config.forecastConfig.anomaliesMaskCanvas, config.ctx.animationBuffer, config, false);

    // restore the original context for other renderers
    ctx = config.ctx.animationBuffer;
  }

  function renderLine(dataColumns, seriesIndex, { xDomainOffset, color, renderDots = true, lineWidth = 2 }) {
    ctx.beginPath();

    let previousX = Number.MAX_VALUE * -1;

    const singlePointsToRender = [];

    // going left to right
    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];

      // existense of data points in all rows is not guaranteed - skip column for this series
      if (!dataRow) {
        continue;
      }

      const xToRender = x.getRange(dataRow[0] + xDomainOffset);
      const yToRender = y.getRange(dataRow[1]);

      // draw these points later on as otherwise we would fill the line chart.
      singlePointsToRender.push({
        x: xToRender,
        y: yToRender
      });

      if (xToRender - previousX > config.maxDistanceBetweenPoints || columnIndex === 0) {
        ctx.moveTo(xToRender, yToRender);
      } else {
        ctx.lineTo(xToRender, yToRender);
      }

      previousX = xToRender;
    }

    color = color || colors[seriesIndex];

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();

    ctx.fillStyle = color;
    if (renderDots) {
      const draw = drawPoint.bind(this, ctx);
      singlePointsToRender.forEach(draw);
    }
  }

  function render(dataColumns) {
    for (let seriesIndex = 0; seriesIndex < config[axisName].numberOfSeries; seriesIndex++) {
      if (activeSeries[seriesIndex] === false) {
        continue;
      }

      renderLine(dataColumns, seriesIndex, { xDomainOffset });
    }
  }
}
