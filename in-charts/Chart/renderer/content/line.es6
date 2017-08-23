export default function createLineContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const x = config.scales.x;
  const y = config.scales[axisName];
  const axisConfig = config[axisName];
  const colors = axisConfig.colors;

  return {
    requireExistenceInAllSeries: false,
    processNewDataColumns() {},
    render,
    renderForecasts
  };

  function renderForecasts(dataColumns) {
    let xDomainOffset = 0;
    if (axisConfig.aggregation) {
      xDomainOffset -= axisConfig.dynamicCalculatedBlockSizeMillis / 2;
    }

    const forecastConfig = config[axisName].forecastConfig;
    const numberOfForecasts = forecastConfig.metrics.length;
    for (let forecastIndex = 0; forecastIndex < numberOfForecasts; forecastIndex++) {
      // the series is garuanteed twice the size as the forecast metrics (low, high)
      const seriesIndex = forecastIndex * 2;
      renderLine(false, dataColumns, seriesIndex + 1, xDomainOffset);
      renderLine(true, dataColumns, seriesIndex, xDomainOffset);
    }
  }

  function renderLine(isForecastLow, dataColumns, seriesIndex, xDomainOffset) {
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

  function render(dataColumns) {
    let xDomainOffset = 0;
    if (axisConfig.aggregation) {
      xDomainOffset -= axisConfig.dynamicCalculatedBlockSizeMillis / 2;
    }

    const activeSeries = config.activeSeries[axisName];
    for (let seriesIndex = 0; seriesIndex < config[axisName].numberOfSeries; seriesIndex++) {
      if (activeSeries[seriesIndex] === false) {
        continue;
      }
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

      ctx.lineWidth = 2;
      ctx.strokeStyle = colors[seriesIndex];
      ctx.stroke();

      ctx.fillStyle = colors[seriesIndex];
      singlePointsToRender.forEach(drawPoint);
    }
  }

  function drawPoint(point) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI, false);
    ctx.fill();
  }
}
