export function draw({dataColumns, ctx, series, x, y, rollUpInMillis}) {
  series.forEach((s, seriesIndex) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.fillStyle = s.color;

    const barWidth = x(rollUpInMillis) - x(0);

    // going left to right
    for (let columnIndex = 0, len = dataColumns.length; columnIndex < len; columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];
      const X = x(dataRow.x);
      const Y = y(dataRow.y);

      ctx.fillRect(X - barWidth / 2, Y, barWidth, y(0) - Y);
    }

    ctx.stroke();
  });
}
