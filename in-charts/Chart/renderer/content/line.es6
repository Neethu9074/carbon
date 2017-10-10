import { copyCanvasInto, drawPoint } from 'in-charts/Chart/buffer';

export default function createLineContentRenderer({ axisName, config }) {
  let ctx = config.ctx.animationBuffer;
  let xDomainOffset = 0;

  const x = config.scales.x;
  const y = config.scales[axisName];
  const axis = config[axisName];
  const colors = axis.colors;

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
    const activeSeries = config.activeSeries[axisName];
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
      renderArea(dataColumns, seriesIndex, xDomainOffset);
    }
  }

  function renderArea(dataColumns, seriesIndex, xDomainOffset) {
    const seriesHighIndex = seriesIndex + 1;
    const seriesLowIndex = seriesIndex;

    ctx.beginPath();

    function renderAreaLine(columnIndex, index) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[index];

      // existense of data points in all rows is not guaranteed - skip column for this series
      if (!dataRow) {
        return;
      }

      const xToRender = x.getRange(dataRow[0] + xDomainOffset);
      const yToRender = y.getRange(dataRow[1]);

      ctx.lineTo(xToRender, yToRender);
    }

    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      renderAreaLine(columnIndex, seriesHighIndex);
    }

    for (let columnIndex = dataColumns.length - 1; columnIndex > 0; columnIndex--) {
      renderAreaLine(columnIndex, seriesLowIndex);
    }

    ctx.closePath();
    ctx.fillStyle = '#e5e5e5';
    ctx.fill();
  }

  function renderAnomalies(metricDataColumns, forecastDataColumns, anomalyTimestampMap) {
    ctx = config.forecastConfig.anomaliesMaskCanvasContext;
    ctx.clearRect(0, 0, config.width, config.height);

    const activeSeries = config.activeSeries[axisName];
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
      renderLine(metricDataColumns, metricSeriesIndex, {
        xDomainOffset,
        color: '#ff4229',
        lineWidth: 3,
        timestampLUT: anomalyTimestampMap
      });

      ctx.globalCompositeOperation = 'destination-out';
      renderArea(forecastDataColumns, seriesIndex, xDomainOffset);

      // restore default operation
      ctx.globalCompositeOperation = 'source-over';
    }

    copyCanvasInto(config.forecastConfig.anomaliesMaskCanvas, config.ctx.animationBuffer, config, false);

    // restore the original context for other renderers
    ctx = config.ctx.animationBuffer;
  }

  function renderLine(dataColumns, seriesIndex, { xDomainOffset, color, lineWidth = 2, timestampLUT }) {
    ctx.beginPath();

    const singlePointsToRender = [];

    // going left to right
    let previousX = Number.MAX_VALUE * -1;
    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];

      // existense of data points in all rows is not guaranteed - skip column for this series
      if (!dataRow || (timestampLUT && !timestampLUT[dataRow.time])) {
        continue;
      }

      const xToRender = x.getRange(dataRow[0] + xDomainOffset);
      const yToRender = y.getRange(dataRow[1]);

      if (xToRender - previousX > 10) {
        // draw these points later on as otherwise we would fill the line chart.
        singlePointsToRender.push({
          x: xToRender,
          y: yToRender
        });
      }

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
    const draw = drawPoint.bind(this, ctx);
    singlePointsToRender.forEach(draw);
  }

  function render(dataColumns) {
    const activeSeries = config.activeSeries[axisName];
    for (let seriesIndex = 0; seriesIndex < config[axisName].numberOfSeries; seriesIndex++) {
      if (activeSeries[seriesIndex] === false) {
        continue;
      }

      renderLine(dataColumns, seriesIndex, { xDomainOffset });
    }
  }
}
