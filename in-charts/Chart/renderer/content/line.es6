export default function createLineContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const x = config.scales.x;
  const y = config.scales[axisName];
  const colors = config[axisName].colors;

  return {
    requireExistenceInAllSeries: false,
    processNewDataColumns() {},
    render
  };

  function render(dataColumns) {
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

        const xToRender = x.getRange(dataRow[0]);
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
    // ctx.rect(point.x - 1.5, point.y - 1.5, 3, 3);
  }
}
