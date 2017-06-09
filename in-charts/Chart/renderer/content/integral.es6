import createLineContentRenderer from 'in-charts/Chart/renderer/content/line';

export default function createStackedAreaContentRenderer({ axisName, config }) {
  const ctx = config.ctx.animationBuffer;
  const y = config.scales[axisName];
  const x = config.scales.x;
  const colors = config[axisName].colors;

  const lineRenderer = createLineContentRenderer({ axisName, config });

  return {
    requireExistenceInAllSeries: true,
    processNewDataColumns() {},
    render
  };

  function render(dataColumns) {
    const seriesActivity = Object.keys(config.activeSeries[axisName]).map(key => config.activeSeries[axisName][key]);

    const exactlyOneActiveSeries = seriesActivity.filter(b => b).length == 1;

    const lowestActiveSeriesIndex = seriesActivity.indexOf(true);
    const highestActiveSeriesIndex = seriesActivity.lastIndexOf(true);

    const sameDataForAllActiveSeries = Array.from(Array(dataColumns.length).keys()).every(minIsSameAsMax);

    if (exactlyOneActiveSeries || sameDataForAllActiveSeries) {
      return lineRenderer.render(
        dataColumns.map(column => {
          return { [lowestActiveSeriesIndex]: column[lowestActiveSeriesIndex] };
        })
      );
    }

    let currentRenderIndex = 0;
    const end = dataColumns.length - 1;
    while (currentRenderIndex < end) {
      currentRenderIndex = renderUntilGap(currentRenderIndex);
    }

    function renderUntilGap(startingPoint) {
      let endIndex = null;

      for (
        let seriesIndex = config[axisName].numberOfSeries - 1;
        seriesIndex > lowestActiveSeriesIndex;
        seriesIndex--
      ) {
        endIndex = config.activeSeries[axisName][seriesIndex]
          ? renderSeries(seriesIndex, startingPoint, colors[seriesIndex])
          : dataColumns.length;
      }

      endIndex = renderSeries(lowestActiveSeriesIndex, startingPoint, '#fff');

      return endIndex;
    }

    function minIsSameAsMax(columnIndex) {
      return (
        dataColumns[columnIndex][lowestActiveSeriesIndex][1] === dataColumns[columnIndex][highestActiveSeriesIndex][1]
      );
    }

    function previousMinIsSameAsMax(columnIndex) {
      return minIsSameAsMax(columnIndex - 1);
    }

    function renderWhite(previousDomainY, yToRender, previousX, xToRender) {
      const previousY = y.getRange(previousDomainY);
      const yDifference = yToRender - previousY;

      if (Math.abs(yDifference) > 10) {
        const factorX = yDifference > 0 ? -1 : 1;

        ctx.lineTo(previousX + 1 * factorX, previousY);
        ctx.lineTo(xToRender + 1 * factorX, yToRender);
        ctx.lineTo(xToRender, yToRender);
      } else {
        ctx.lineTo(xToRender, yToRender + 1);
      }
    }

    function renderSeries(seriesIndex, startingPoint, color) {
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

        const isAtStartingPoint = columnIndex === startingPoint;

        if (isAtStartingPoint) {
          // subtract one to ensure that the line is always visible
          ctx.moveTo(xToRender, y.getRange(dataRow[1]) - 1);
          previousX = xToRender;
        } else if (xToRender - previousX > config.maxDistanceBetweenPoints) {
          seriesEndIndex = columnIndex;
        } else if (minIsSameAsMax(columnIndex) || previousMinIsSameAsMax(columnIndex)) {
          const isWhiteSeries = seriesIndex == lowestActiveSeriesIndex;

          if (isWhiteSeries) {
            const previousDomainY = dataColumns[columnIndex - 1][seriesIndex][1];
            const yToRender = y.getRange(dataRow[1]);

            renderWhite(previousDomainY, yToRender, previousX, xToRender);
          } else {
            ctx.lineTo(xToRender, y.getRange(dataRow[1]) - 1);
          }
          previousX = xToRender;
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
