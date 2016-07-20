export function draw({dataColumns, ctx, series, x, y, maxDistanceBetweenPoints, filters}) {
  let currentRenderIndex = 0;
  const end = dataColumns.length - 1;
  while (currentRenderIndex < end) {
    currentRenderIndex = renderUntilGap(currentRenderIndex);
  }

  function renderUntilGap(startingPoint) {
    let endIndex = null;

    for (let seriesIndex = series.length - 1; seriesIndex >= 0; seriesIndex--) {
      const s = series[seriesIndex];
      ctx.beginPath();

      let previousX = Number.MAX_VALUE * -1;
      let seriesEndIndex = null;

      // going left to right
      for (let columnIndex = startingPoint, len = dataColumns.length;
         columnIndex < len && seriesEndIndex == null;
         columnIndex++) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];
        const xToRender = x(dataRow.x);

        if (columnIndex === startingPoint) {
          // subtract one to ensure that the line is always visible
          ctx.moveTo(xToRender, y(dataRow.y1) - 1);
          previousX = xToRender;
        } else if ((xToRender - previousX) > maxDistanceBetweenPoints) {
          seriesEndIndex = columnIndex;
        } else {
          // subtract one to ensure that the line is always visible
          ctx.lineTo(xToRender, y(dataRow.y1) - 1);
          previousX = xToRender;
        }
      }

      if (seriesEndIndex == null) {
        seriesEndIndex = dataColumns.length;
      }

      // going right to left to draw the bottom line
      for (let columnIndex = seriesEndIndex - 1;
         columnIndex >= startingPoint;
         columnIndex--) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];

        ctx.lineTo(x(dataRow.x), y(dataRow.y0));
      }

      ctx.closePath();
      ctx.fillStyle = s.color;
      if (!filters[s.label]) {
        ctx.fill();
      }
      endIndex = seriesEndIndex;
    }

    return endIndex;
  }
}


export function processNewDataColumns(newDataColumns) {
  newDataColumns.forEach(dataColumn => {
    dataColumn.forEach(dataRow => {
      dataRow.y0 = 0;
      dataRow.y1 = dataRow.y;
    });
  });
}
