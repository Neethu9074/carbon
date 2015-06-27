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

      // left to right
      dataColumns.forEach((dataColumn, columnIndex) => {
        const dataRow = dataColumn[seriesIndex];
        const x = this.x(dataRow.x);
        const y1 = this.y(dataRow.y1);

        if (columnIndex === 0) {
          ctx.moveTo(x, y1);
        } else {
          ctx.lineTo(x, y1);
          console.log('line to', x, y1);
        }
      });

      // TODO move right to left

      ctx.closePath();
      ctx.fillStyle = this.getSeriesColor(seriesIndex);
      ctx.fill();
      ctx.strokeStyle = 'red';
      ctx.stroke();
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
