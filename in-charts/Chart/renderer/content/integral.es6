export default function createStackedAreaContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const x = config.scales.x;
  const y = config.scales[axisName];
  const colors = config[axisName].colors;

  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns() {},
    render
  };

  function render(dataColumns) {
    let currentRenderIndex = 0;
    const end = dataColumns.length - 1;
    while (currentRenderIndex < end) {
      currentRenderIndex = renderUntilGap(currentRenderIndex);
    }

    function renderUntilGap(startingPoint) {
      let endIndex = null;

      for (let seriesIndex = config[axisName].numberOfSeries - 1; seriesIndex > 0; seriesIndex--) {
        endIndex = renderSeries(seriesIndex, startingPoint, colors[seriesIndex]);
      }

      endIndex = renderSeries(0, startingPoint, '#fff');

      return endIndex;
    }

    function renderSeries(seriesIndex, startingPoint, color) {
      const activeSeries = config.activeSeries[axisName];
      if (activeSeries[seriesIndex] === false) {
        return dataColumns.length;
      }

      ctx.beginPath();

      let previousX = Number.MAX_VALUE * -1;
      let seriesEndIndex = null;

      // going left to right
      for (
        let columnIndex = startingPoint, len = dataColumns.length;
        columnIndex < len && seriesEndIndex == null;
        columnIndex++
      ) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];
        const xToRender = x.getRange(dataRow[0]);

        if (columnIndex === startingPoint) {
          // subtract one to ensure that the line is always visible
          ctx.moveTo(xToRender, y.getRange(dataRow[1]) - 1);
          previousX = xToRender;
        } else if (xToRender - previousX > config.maxDistanceBetweenPoints) {
          seriesEndIndex = columnIndex;
        } else {
          // subtract one to ensure that the line is always visible
          ctx.lineTo(xToRender, y.getRange(dataRow[1]) - 1);
          previousX = xToRender;
        }
      }

      if (seriesEndIndex == null) {
        seriesEndIndex = dataColumns.length;
      }

      // going right to left to draw the bottom line
      for (let columnIndex = seriesEndIndex - 1; columnIndex >= startingPoint; columnIndex--) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];

        ctx.lineTo(x.getRange(dataRow[0]), y.getRangeFrom());
      }

      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      return seriesEndIndex;
    }
  }
}
