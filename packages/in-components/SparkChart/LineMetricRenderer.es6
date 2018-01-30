import createScale from 'in-charts/scale';

import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';

export default class LineMetricRenderer {
  constructor(canvas, props = {}) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    const { paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0 } = props;

    this.xScale = createScale();
    this.xScale.setRangeFrom(paddingLeft);
    this.xScale.setRangeTo(canvas.width - paddingRight);

    this.yScale = createScale();
    this.yScale.setRangeFrom(paddingTop);
    this.yScale.setRangeTo(canvas.height - paddingBottom);

    this.metrics = [];

    this.ctx = canvas.getContext('2d');
  }

  update({ metrics = [], rollup = 1000, timeframe }) {
    this.xScale.setDomainFrom(timeframe.to - timeframe.windowSize);
    this.xScale.setDomainTo(timeframe.to);

    // inverse this since canvas has y direction from top(0) to bottom(100%)
    const { minMetricValue, maxMetricValue } = this.calculateMetricStatistics(metrics);
    this.yScale.setDomainFrom(maxMetricValue);
    this.yScale.setDomainTo(minMetricValue);

    this.blocks = this.calculateBlocks(metrics, rollup);
  }

  calculateMetricStatistics(metrics) {
    let maxMetricValue = 0;
    let minMetricValue = Number.MAX_VALUE;
    for (let i = 0; i < metrics.length; i++) {
      minMetricValue = Math.min(minMetricValue, metrics[i][1]);
      maxMetricValue = Math.max(maxMetricValue, metrics[i][1]);
    }
    return { minMetricValue, maxMetricValue };
  }

  calculateBlocks(metrics, rollup) {
    const blocks = [];
    if (metrics.length === 0) {
      return blocks;
    }

    const maxDistanceBetweenDatapointsInMillis = this.calculateMaxMillisBetweenDatapoints(rollup);

    let currentBlock = [];
    blocks.push(currentBlock);

    metrics = this.mapMetricsToAStructureWhichIsEasyToConsume(metrics);
    for (let i = 0; i < metrics.length; i++) {
      const dataPoint = metrics[i];
      currentBlock.push(dataPoint);

      const nextDataPoint = i + 1 < metrics.length ? metrics[i + 1] : dataPoint;
      const isEndOfBlock = nextDataPoint.xDomain - dataPoint.xDomain > maxDistanceBetweenDatapointsInMillis;
      if (isEndOfBlock) {
        currentBlock = [];
        blocks.push(currentBlock);
      }
    }

    return blocks;
  }

  calculateMaxMillisBetweenDatapoints(rollup) {
    if (rollup === 1000) {
      return allowedMillisGapsInOneSecondResolution;
    }
    return rollup * allowedMultiplesOfRollupSizeMissingInCharts;
  }

  mapMetricsToAStructureWhichIsEasyToConsume(metrics) {
    return metrics.map(dataPoint => ({
      x: this.getX(dataPoint),
      y: this.getY(dataPoint),
      value: dataPoint[1],
      xDomain: dataPoint[0]
    }));
  }

  getX(dataPoint) {
    return this.xScale.getRange(dataPoint[0]);
  }

  getY(dataPoint) {
    return this.yScale.getRange(dataPoint[1]);
  }

  render() {
    if (this.blocks.length === 0) {
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#1fb7b9';

    this.renderBlocks();
    this.renderDataPoints();
  }

  renderBlocks() {
    this.ctx.fillStyle = '#e8f7f8';
    for (let i = 0; i < this.blocks.length; i++) {
      this.drawBlock(this.blocks[i]);
    }
  }

  drawBlock(block) {
    if (block.length <= 1) {
      return;
    }
    const firstDataPoint = block[0];
    const lastDataPoint = block[block.length - 1];

    this.ctx.beginPath();
    this.ctx.moveTo(firstDataPoint.x, firstDataPoint.y);

    for (let i = 1; i < block.length; i++) {
      const dataPoint = block[i];
      this.ctx.lineTo(dataPoint.x, dataPoint.y);
    }

    this.ctx.stroke();
    this.ctx.lineTo(lastDataPoint.x, this.height);
    this.ctx.lineTo(firstDataPoint.x, this.height);
    this.ctx.closePath();
    this.ctx.fill();
  }

  renderDataPoints() {
    this.ctx.fillStyle = '#1fb7b9';
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      for (let iB = 0; iB < block.length; iB++) {
        const dataPoint = block[iB];
        this.ctx.beginPath();
        this.ctx.arc(dataPoint.x, dataPoint.y, 2, 0, 2 * Math.PI, false);
        this.ctx.fill();
      }
    }
  }
}
