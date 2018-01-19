import createScale from 'in-charts/scale';

export default class LineMetricRenderer {
  constructor(canvas, scale) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.xScale = scale;
    this.ctx = canvas.getContext('2d');

    this.yScale = createScale();
  }

  render(metrics) {
    if (metrics.length === 0) {
      return;
    }
    this.updateYScale(metrics);

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();

    const firstDataPoint = metrics[0];
    this.ctx.moveTo(this.getX(firstDataPoint), this.getY(firstDataPoint));

    for (let i = 1; i < metrics.length; i++) {
      const dataPoint = metrics[i];
      const x = this.getX(dataPoint);
      const y = this.getY(dataPoint);

      this.ctx.lineTo(x, y);
    }

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#1fb7b9';
    this.ctx.stroke();

    this.closeAndDrawBackground(metrics);
    this.drawPoints(metrics);
  }

  updateYScale(metrics) {
    const maxMetricValue = this.getMaxMetricValue(metrics);

    this.yScale.setRangeFrom(0);
    this.yScale.setRangeTo(this.height - 2);

    // inverse this since canvas has y direction from top(0) to bottom(100%)
    this.yScale.setDomainFrom(maxMetricValue);
    this.yScale.setDomainTo(0);
  }

  getMaxMetricValue(metrics) {
    let maxMetricValue = 0;
    for (let i = 0; i < metrics.length; i++) {
      maxMetricValue = Math.max(maxMetricValue, metrics[i][1]);
    }
    return maxMetricValue;
  }

  closeAndDrawBackground(metrics) {
    const firstDataPoint = metrics[0];
    const lastDataPoint = metrics[metrics.length - 1];

    this.ctx.lineTo(this.xScale.getRange(lastDataPoint[0]), this.height);
    this.ctx.lineTo(this.xScale.getRange(firstDataPoint[0]), this.height);
    this.ctx.closePath();
    this.ctx.fillStyle = '#e8f7f8';
    this.ctx.fill();
  }

  drawPoints(metrics) {
    this.ctx.beginPath();
    for (let i = 0; i < metrics.length; i++) {
      const dataPoint = metrics[i];
      const x = this.getX(dataPoint);
      const y = this.getY(dataPoint);

      this.ctx.rect(x - 1, y - 1, 2, 2);
    }

    this.ctx.fillStyle = '#1fb7b9';
    this.ctx.fill();
  }

  getX(dataPoint) {
    return this.xScale.getRange(dataPoint[0]) + 1;
  }

  getY(dataPoint) {
    return this.yScale.getRange(dataPoint[1]) + 1;
  }
}
