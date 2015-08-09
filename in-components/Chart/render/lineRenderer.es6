

export function draw({dataColumns, ctx, series, x, y}) {
  series.forEach((s, seriesIndex) => {
    ctx.beginPath();

    // going left to right
    for (let columnIndex = 0, len = dataColumns.length;
       columnIndex < len;
       columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];

      if (columnIndex === 0) {
        ctx.moveTo(x(dataRow.x), y(dataRow.y));
      } else {
        ctx.lineTo(x(dataRow.x), y(dataRow.y));
      }
    }

    ctx.lineWidth = 2;
    ctx.strokeStyle = s.color;
    ctx.stroke();
  });
}
