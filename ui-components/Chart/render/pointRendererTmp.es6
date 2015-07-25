'use strict';

const CIRCLE_ARC = 2 * Math.PI;

export function draw({dataColumns, ctx, series, x, y}) {
  series.forEach((s, seriesIndex) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = s.color;

    // going left to right
    for (let columnIndex = 0, len = dataColumns.length;
       columnIndex < len;
       columnIndex++) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];
      ctx.beginPath();
      ctx.arc(x(dataRow.x), y(dataRow.y), 2, 0, CIRCLE_ARC);
      ctx.closePath();
      ctx.stroke();
    }
  });
}
