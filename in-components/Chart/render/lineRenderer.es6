export function draw({dataColumns, ctx, series, x, y, maxDistanceBetweenPoints}) {
  series.forEach((s, seriesIndex) => {
    ctx.beginPath();

    let previousX = Number.MAX_VALUE * -1;
    // going left to right
    for (let columnIndex = 0, len = dataColumns.length;
         columnIndex < len;
         columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];
      const xToRender = x(dataRow.x);

      if ((xToRender - previousX) > maxDistanceBetweenPoints || columnIndex === 0) {
        ctx.moveTo(xToRender, y(dataRow.y));
      } else {
        ctx.lineTo(xToRender, y(dataRow.y));
      }

      previousX = xToRender;
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = s.color;
    ctx.stroke();
  });
}
