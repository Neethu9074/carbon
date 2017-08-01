export default function createDiscreteLineContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const x = config.scales.x;
  const y = config.scales[axisName];
  const colors = config[axisName].colors;
  const margin = 2;

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
      ctx.globalAlpha = 0.3;
      ctx.beginPath();

      let previousX = Number.MAX_VALUE * -1;

      const pointsToRender = [];

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

        if (xToRender - previousX > config.maxDistanceBetweenPoints || columnIndex === 0) {
          ctx.moveTo(xToRender, yToRender);
        } else {
          ctx.lineTo(xToRender, yToRender);

          pointsToRender.push({
            x: xToRender,
            y: yToRender
          });
        }

        previousX = xToRender;
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = colors[seriesIndex];
      ctx.stroke();

      ctx.beginPath();
      ctx.fillStyle = colors[seriesIndex];
      ctx.globalAlpha = 1.0;

      const toY = y.getRangeTo() + margin;
      const draw = drawPoint.bind(null, toY);
      pointsToRender.forEach(draw);

      ctx.fill();
    }
  }

  function drawPoint(toY, point) {
    if (point.y < toY) {
      point.y += margin;
    }
    ctx.rect(point.x - 2, point.y - 2, 3, 3);
  }
}
