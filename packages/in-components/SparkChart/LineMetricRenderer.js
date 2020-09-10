import theme from 'in-themes';

import {
  allowedMultiplesOfRollupSizeMissingInCharts,
  allowedMillisGapsInOneSecondResolution
} from 'in-services/featureFlags';
import createScale from 'in-services/scale';

export default class LineMetricRenderer {
  constructor(canvas, props = {}) {
    this.canvas = canvas;

    this.width = props.width;
    this.height = props.height;
    this.percentageMetric = props.percentageMetric;
    this.theme = props.theme;

    const { paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0 } = props;

    this.xScale = createScale();
    this.xScale.setRangeFrom(paddingLeft);
    this.xScale.setRangeTo(this.width - paddingRight);

    this.yScale = createScale();
    this.yScale.setRangeFrom(paddingTop);
    this.yScale.setRangeTo(this.height - paddingBottom);

    this.ctx = canvas.getContext('2d');
  }

  update({ metrics = [], rollup = 1000, timeConfig }) {
    const to = timeConfig.to;
    this.xScale.setDomainFrom(to - timeConfig.windowSize);
    this.xScale.setDomainTo(to);

    // inverse this since canvas has y direction from top(0) to bottom(100%)
    const { lowerBound, upperBound } = this.calculateMetricStatistics(metrics);
    this.yScale.setDomainFrom(upperBound);
    this.yScale.setDomainTo(lowerBound);

    this.blocks = this.calculateBlocks(metrics, rollup);
  }

  calculateMetricStatistics(metrics) {
    let sumMetricValues = 0;
    let maxMetricValue = 0;
    let minMetricValue = 0;
    for (let i = 0; i < metrics.length; i++) {
      let value = metrics[i][1];
      if (value) {
        // Skip undefined datapoints
        sumMetricValues += value;
        minMetricValue = Math.min(minMetricValue, value);
        maxMetricValue = Math.max(maxMetricValue, value);
      }
    }

    /*
     * We have all datapoints in the metrics, and we wanna provide
     * a Y value based on the standard deviation. Assuming that up
     * we will often encounter up to 4 standard deviations normally,
     * and that changes within that range should not cause a panic,
     * we will extend the max value of the scale to extend to 4
     * standard deviations above the average of the chart. If there
     * are datapoints above four standard deviations, use their values
     * as max range, so that they will appear on the top of the sparkchart
     * and that will indicate "there is a big jump there."
     *
     * Below the chart we plot always from 0: all the data points we
     * need to show have positive values, and the Y axis starting from
     * zero avoids misrepresenting a sharp drop with "the value is
     * exactly zero", which causes unnecessary panic with respect to
     * call counts. Also, when the datapoints we plot are averagely
     * large and similar to one another, plotting from zero has the
     * very nice side-effect of smoothing the curve, giving the
     * perspective that, in the big scheme of things, nothing has changes
     * "that much."
     */

    let upperBoundValue = maxMetricValue;
    let standardDeviation = 0;

    if (metrics.length) {
      const valuesAverage = sumMetricValues / metrics.length;

      const squareDiffsSum = metrics
        // Filter out datapoints with undefined values
        .filter(dataPoint => !!dataPoint[1])
        .map(dataPoint => Math.pow(dataPoint[1] - valuesAverage, 2))
        .reduce((squareDiff1, squareDiff2) => squareDiff1 + squareDiff2, 0);

      const squareDiffsAverage = squareDiffsSum / metrics.length;

      standardDeviation = Math.sqrt(squareDiffsAverage);

      upperBoundValue = valuesAverage + standardDeviation * 4;
    }

    const lowerBound = Math.min(minMetricValue, 0);

    /*
     * In case of very large variability, where the maximum value is higher
     * than average plus four standard deviations, we need to allow the chart
     * to paint the full range.
     */
    let upperBound = Math.max(maxMetricValue, upperBoundValue);
    if (this.percentageMetric) {
      if (upperBound < 0.05) {
        upperBound = 0.05;
      }
    } else if (upperBound > 0 && upperBound < 5 && standardDeviation > 0 && standardDeviation < 1) {
      /*
       * Let's put in perspective those pesky 1%~3% error rate spikes.
       * With spikes over 5%, the headroom built based on standard deviation
       * should provide enough perspective.
       */
      upperBound = 5;
    }

    return { lowerBound, upperBound };
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
    if (dataPoint[1] === 0) {
      // force 0 value data point to be rendered at the bottom
      return this.yScale.getRangeTo();
    }
    return this.yScale.getRange(dataPoint[1]);
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.blocks.length === 0) {
      return;
    }

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = theme.lib.colors.chart.strokeColors100[0];

    this.renderBlocks();
    this.renderDataPoints();
  }

  renderBlocks() {
    if (this.theme === 'light') {
      this.ctx.fillStyle = theme.lib.colors.chart.strokeColors25[0];
    } else {
      this.ctx.fillStyle = theme.lib.colors.N700Medium;
    }

    for (let i = 0; i < this.blocks.length; i++) {
      this.drawBlock(this.blocks[i]);
    }
  }

  drawBlock(block) {
    /*
     * Create paths that represent areas under sequences
     * that have no consecuritve zeros inside, because in
     * those cases we would pain area highlight under the
     * line connecting two zeros and it is wrong.
     */
    let dataPoints = Array.from(block);

    while (dataPoints.length) {
      let firstDataPoint = dataPoints.shift();

      if (!dataPoints.length || !dataPoints[0].value) {
        /*
         * The next item is undefined or a zero
         */
        if (firstDataPoint.value) {
          /*
           * This is a single, non-zero data point.
           * Paint a small area under it.
           */
          const halfWidthArea = 2;

          this.ctx.beginPath();

          this.ctx.moveTo(firstDataPoint.x - halfWidthArea, firstDataPoint.y);
          this.ctx.lineTo(firstDataPoint.x + halfWidthArea, firstDataPoint.y);
          this.ctx.lineTo(firstDataPoint.x + halfWidthArea, this.height);
          this.ctx.lineTo(firstDataPoint.x - halfWidthArea, this.height);
          this.ctx.fill();

          this.ctx.closePath();
        }

        continue;
      }

      /*
       * "Peek" if the next data point is also zero and,
       * if so, skippity-skip.
       */
      let nextDataPoint = dataPoints[0];

      if (!firstDataPoint.value && !nextDataPoint.value) {
        /*
         * We are in a zero "plateu".
         */
        continue;
      }

      this.ctx.beginPath();
      this.ctx.moveTo(firstDataPoint.x, firstDataPoint.y);

      /*
       * Consume all the points until the "next plateu" or
       * the end of the series.
       */
      do {
        nextDataPoint = dataPoints.shift();
        this.ctx.lineTo(nextDataPoint.x, nextDataPoint.y);
      } while (dataPoints.length && nextDataPoint.value);

      /*
       * Put the last item back in the dataPoints array, so that
       * we process it in the next block.
       */
      if (!nextDataPoint.value) {
        dataPoints.unshift(nextDataPoint);
      }

      this.ctx.lineTo(nextDataPoint.x, this.height);
      this.ctx.lineTo(firstDataPoint.x, this.height);
      this.ctx.fill();

      this.ctx.closePath();
    }

    {
      if (block.length < 2) {
        // Only one item in the block, no lines need to be painted
        return;
      }

      // Scoping to avoid issues with firstDataPoint already being defined
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
    }
  }

  renderDataPoints() {
    if (this.theme === 'light') {
      this.drawPoints('#ffffff', 3);
    } else {
      this.drawPoints(theme.lib.colors.N900Primary, 3);
    }
    this.drawPoints(theme.lib.colors.chart.strokeColors100[0], 2, true);
  }

  drawPoints(fillStyle, radius, withRespectToZeroValues = false) {
    this.ctx.fillStyle = fillStyle;
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      for (let iB = 0; iB < block.length; iB++) {
        this.ctx.fillStyle = fillStyle;
        const dataPoint = block[iB];
        this.ctx.beginPath();
        this.ctx.arc(dataPoint.x, dataPoint.y, radius, 0, 2 * Math.PI, false);
        this.ctx.fill();

        if (withRespectToZeroValues && dataPoint.value == 0) {
          /*
           * To help differentiate zero from some other value,
           * paint the dot representing zero as a thin blue halo
           */
          this.ctx.arc(dataPoint.x, dataPoint.y, 1, 0, 2 * Math.PI, false);
          this.ctx.fillStyle = '#c8ddec';
          this.ctx.fill();
        }
      }
    }
  }
}
