export default function createStackedAreaContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const x = config.scales.x;
  const y = config.scales[axisName];
  const colors = config[axisName].colors;
  const numberOfSeries = config[axisName].numberOfSeries;

  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns,
    getBoundsForRow,
    render
  };

  function processNewDataColumns(dataColumns) {
    const activeSeries = config.activeSeries[axisName];
    dataColumns.forEach(dataColumn => {
      let sum = 0;
      dataColumn.forEach((dataRow, i) => {
        if (activeSeries[i] === true) {
          dataRow.y0 = sum;
          sum += dataRow[1];
          dataRow.y1 = sum;
        }
      });
    });
  }

  function getBoundsForRow(dataRow) {
    if (!config.hasActiveFilters) {
      return [dataRow[0].y0, dataRow[dataRow.length - 1].y1];
    }

    const activeSeries = config.activeSeries[axisName];
    let max = Number.NEGATIVE_INFINITY;
    let min = Number.POSITIVE_INFINITY;

    for (let i = 0; i < numberOfSeries; i++) {
      if (activeSeries[i] === true) {
        min = Math.min(min, dataRow[i].y0);
        max = Math.max(max, dataRow[i].y1);
      }
    }

    return [min, max];
  }

  function render(dataColumns) {
    const activeSeries = config.activeSeries[axisName];
    let currentRenderIndex = 0;
    const end = dataColumns.length - 1;
    while (currentRenderIndex < end) {
      currentRenderIndex = renderUntilGap(currentRenderIndex);
    }

    function renderUntilGap(startingPoint) {
      let endIndex = null;

      for (let seriesIndex = 0; seriesIndex < numberOfSeries; seriesIndex++) {
        if (activeSeries[seriesIndex] === false) {
          continue;
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
            ctx.moveTo(xToRender, y.getRange(dataRow.y1) - 1);
            previousX = xToRender;
          } else if (xToRender - previousX > config.maxDistanceBetweenPoints) {
            seriesEndIndex = columnIndex;
          } else {
            // subtract one to ensure that the line is always visible
            ctx.lineTo(xToRender, y.getRange(dataRow.y1) - 1);
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

          ctx.lineTo(x.getRange(dataRow[0]), y.getRange(dataRow.y0));
        }

        ctx.closePath();
        ctx.fillStyle = colors[seriesIndex];
        ctx.fill();
        endIndex = seriesEndIndex;
      }

      return endIndex;
    }
  }
}
