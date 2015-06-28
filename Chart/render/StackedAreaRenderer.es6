'use strict';

import BaseRenderer from './BaseRenderer';

export default class StackedAreaRenderer extends BaseRenderer {

  constructor(opts) {
    super(opts);

    this.container.classList.add('in-chart--stacked-area');
  }

  draw() {
    const dataColumns = this.data.getDataColumns();
    const ctx = this.drawingCtx;

    this.seriesConfig.forEach((series, seriesIndex) => {
      ctx.beginPath();

      // going left to right
      for (let columnIndex = 0, len = dataColumns.length;
         columnIndex < len;
         columnIndex++) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];
        const x = this.x(dataRow.x);
        const y1 = this.y(dataRow.y1);

        if (columnIndex === 0) {
          ctx.moveTo(x, y1);
        } else {
          ctx.lineTo(x, y1);
        }
      }

      // going right to left
      for (let columnIndex = dataColumns.length - 1;
         columnIndex >= 0;
         columnIndex--) {
        const dataColumn = dataColumns[columnIndex];
        const dataRow = dataColumn[seriesIndex];
        const x = this.x(dataRow.x);
        const y0 = this.y(dataRow.y0);

        ctx.lineTo(x, y0);
      }

      ctx.closePath();
      ctx.fillStyle = this.getSeriesColor(seriesIndex);
      ctx.fill();
    });
  }

  processNewDataColumns(newDataColumns) {
    newDataColumns.forEach(dataColumn => {
      let sum = 0;
      dataColumn.forEach(dataRow => {
        dataRow.y0 = sum;
        sum += dataRow.y;
        dataRow.y1 = sum;
      });
    });
  }

  getMinYFromDataColumn(dataColumn) {
    return dataColumn[0].y0;
  }

  getMaxYFromDataColumn(dataColumn) {
    return dataColumn[dataColumn.length - 1].y1;
  }
}
