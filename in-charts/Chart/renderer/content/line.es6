export default function createLineContentRenderer({axisName, config}) {
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

      const singlePointsToAdd = [];

      // going left to right
      for (let columnIndex = 0, len = dataColumns.length;
           columnIndex < len;
           columnIndex++) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];

        // existense of data points in all rows is not guaranteed - skip column for this series
        if (!dataRow) {
          continue;
        }

        const xToRender = x.getRange(dataRow[0]);
        const yToRender = y.getRange(dataRow[1]);

        if ((xToRender - previousX) > config.maxDistanceBetweenPoints || columnIndex === 0) {
          ctx.moveTo(xToRender, yToRender);

          // draw these points later on as otherwise we would fill the line chart.
          singlePointsToAdd.push({
            x: xToRender,
            y: yToRender
          });
        } else {
          ctx.lineTo(xToRender, yToRender);
        }

        previousX = xToRender;
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = colors[seriesIndex];
      ctx.stroke();

      ctx.beginPath();
      singlePointsToAdd.forEach(drawPoint);
      ctx.fillStyle = colors[seriesIndex];
      ctx.fill();
    }
  }

  function drawPoint(point) {
    ctx.rect(point.x - 1, point.y - 1, 3, 3);
  }
}
