'use strict';

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
        ctx.moveTo(x(dataRow.x), y(dataRow.y1));
      } else {
        ctx.lineTo(x(dataRow.x), y(dataRow.y1));
      }
    }

    // going right to left
    for (let columnIndex = dataColumns.length - 1;
       columnIndex >= 0;
       columnIndex--) {
      const dataColumn = dataColumns[columnIndex];
      const dataRow = dataColumn[seriesIndex];

      ctx.lineTo(x(dataRow.x), y(dataRow.y0));
    }

    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.fill();
  });
}


export function processNewDataColumns(newDataColumns) {
  newDataColumns.forEach(dataColumn => {
    let sum = 0;
    dataColumn.forEach(dataRow => {
      dataRow.y0 = sum;
      sum += dataRow.y;
      dataRow.y1 = sum;
    });
  });
}

export function getMinYFromDataColumn(dataColumn) {
  return dataColumn[0].y0;
}


export function getMaxYFromDataColumn(dataColumn) {
  return dataColumn[dataColumn.length - 1].y1;
}
