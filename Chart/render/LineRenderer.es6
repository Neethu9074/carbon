'use strict';

import BaseRenderer from './BaseRenderer';

export default class LineRenderer extends BaseRenderer {

  constructor(opts) {
    super(opts);

    this.container.classList.add('in-chart--line');
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
        const y = this.y(dataRow.y);

        if (columnIndex === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.strokeStyle = this.getSeriesColor(seriesIndex);
      ctx.stroke();
    });
  }

}
