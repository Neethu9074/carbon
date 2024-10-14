/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { themes } from '@instana/design-tokens';
import { TimeConfig } from '@instana/types';

import {
  allowedMillisGapsInOneSecondResolution,
  allowedMultiplesOfRollupSizeMissingInCharts
} from 'in-services/featureFlags';
import { MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';
import createScale, { ScaleType } from 'in-services/scale';
import { chartColors } from 'in-themes/chartColors';

interface Props {
  width?: number;
  height?: number;
  theme?: string;
  strokeColor?: string;
  fillColor?: string;
  percentageMetric?: boolean;
  showDots?: boolean;

  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
}

export interface LineMetricUpdateProps {
  metrics?: MetricDataSeries;
  rollup?: number;
  timeConfig: TimeConfig;
}

type MetricBlocks = ExpandedMetricDataSeries[];

interface MetricStatistics {
  lowerBound: number;
  upperBound: number;
}

interface ExpandedMetricDataPoint {
  x: number;
  y: number;
  xDomain: number;
  value: number;
}
type ExpandedMetricDataSeries = ExpandedMetricDataPoint[];

export default class LineMetricRenderer {
  canvas: HTMLCanvasElement;
  width: number;
  height: number;
  theme: string | undefined;
  strokeColor?: string;
  fillColor?: string;
  percentageMetric: boolean | undefined;
  showDots: boolean | undefined;
  xScale: ScaleType;
  yScale: ScaleType;
  ctx: CanvasRenderingContext2D;
  blocks: MetricBlocks = [];

  constructor(canvas: HTMLCanvasElement, props: Props = {}) {
    this.canvas = canvas;

    this.width = props.width ?? 0;
    this.height = props.height ?? 0;
    this.percentageMetric = props.percentageMetric;
    this.theme = props.theme;
    this.strokeColor = props.strokeColor;
    this.fillColor = props.fillColor;
    this.showDots = props.showDots;

    const { paddingLeft = 0, paddingRight = 0, paddingTop = 0, paddingBottom = 0 } = props;

    this.xScale = createScale();
    this.xScale.setRangeFrom(paddingLeft);
    this.xScale.setRangeTo(this.width - paddingRight);

    this.yScale = createScale();
    this.yScale.setRangeFrom(paddingTop);
    this.yScale.setRangeTo(this.height - paddingBottom);

    this.ctx = canvas.getContext('2d')!;
  }

  update({ metrics = [], rollup = 1000, timeConfig }: LineMetricUpdateProps): void {
    const to = timeConfig.to ?? 0;
    this.xScale.setDomainFrom(to - timeConfig.windowSize);
    this.xScale.setDomainTo(to);

    // inverse this since canvas has y direction from top(0) to bottom(100%)
    const { lowerBound, upperBound } = this.calculateMetricStatistics(metrics);
    this.yScale.setDomainFrom(upperBound);
    this.yScale.setDomainTo(lowerBound);

    this.blocks = this.calculateBlocks(metrics, rollup);
  }

  calculateMetricStatistics(metrics: MetricDataSeries): MetricStatistics {
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

  calculateBlocks(metrics: MetricDataSeries, rollup: number): MetricBlocks {
    const blocks: MetricBlocks = [];
    if (metrics.length === 0) {
      return blocks;
    }

    const maxDistanceBetweenDatapointsInMillis = this.calculateMaxMillisBetweenDatapoints(rollup);

    let currentBlock: ExpandedMetricDataSeries = [];
    blocks.push(currentBlock);

    const expandedMetrics = this.mapMetricsToAStructureWhichIsEasyToConsume(metrics);

    for (let i = 0; i < expandedMetrics.length; i++) {
      const dataPoint = expandedMetrics[i];
      currentBlock.push(dataPoint);

      const nextDataPoint = i + 1 < expandedMetrics.length ? expandedMetrics[i + 1] : dataPoint;
      const isEndOfBlock = nextDataPoint.xDomain - dataPoint.xDomain > maxDistanceBetweenDatapointsInMillis;
      if (isEndOfBlock) {
        currentBlock = [];
        blocks.push(currentBlock);
      }
    }

    return blocks;
  }

  calculateMaxMillisBetweenDatapoints(rollup: number): number {
    if (rollup === 1000) {
      return allowedMillisGapsInOneSecondResolution;
    }
    return rollup * allowedMultiplesOfRollupSizeMissingInCharts;
  }

  mapMetricsToAStructureWhichIsEasyToConsume(metrics: MetricDataSeries): ExpandedMetricDataSeries {
    return metrics.map(dataPoint => ({
      x: this.getX(dataPoint),
      y: this.getY(dataPoint),
      value: dataPoint[1],
      xDomain: dataPoint[0]
    }));
  }

  getX(dataPoint: MetricDataPoint): number {
    return this.xScale.getRange(dataPoint[0]);
  }

  getY(dataPoint: MetricDataPoint): number {
    if (dataPoint[1] === 0) {
      // force 0 value data point to be rendered at the bottom
      return this.yScale.getRangeTo();
    }
    return this.yScale.getRange(dataPoint[1]);
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.blocks.length === 0) {
      return;
    }

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.strokeColor ?? chartColors.strokeColors100[0];

    this.renderBlocks();
    this.renderDataPoints();
  }

  renderBlocks(): void {
    if (this.fillColor) {
      this.ctx.fillStyle = this.fillColor;
    } else if (this.theme === 'light') {
      this.ctx.fillStyle = chartColors.strokeColors25[0];
    } else {
      this.ctx.fillStyle = themes.default.ids.color.option.neutral['700'];
    }

    for (let i = 0; i < this.blocks.length; i++) {
      this.drawBlock(this.blocks[i]);
    }
  }

  drawBlock(block: ExpandedMetricDataSeries): void {
    /*
     * Create paths that represent areas under sequences
     * that have no consecutive zeros inside, because in
     * those cases we would paint area highlight under the
     * line connecting two zeros and this is wrong.
     */
    let dataPoints = Array.from(block);

    while (dataPoints.length) {
      let firstDataPoint = dataPoints.shift()!;

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
        nextDataPoint = dataPoints.shift()!;
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

    // Anonymous block to avoid const vars already being defined.
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

  renderDataPoints(): void {
    if (this.theme === 'light') {
      this.drawPoints('#ffffff', 3);
    } else {
      this.drawPoints(themes.default.ids.color.option.neutral['900'], 3);
    }
    this.drawPoints(chartColors.strokeColors100[0], 2, true);
  }

  drawPoints(fillStyle: string, radius: number, withRespectToZeroValues = false): void {
    this.ctx.fillStyle = fillStyle;
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      /*
       * This is to check if we want to render dots at all
       * And as a backup if a spot is a single block we want to draw a circle on it.
       * Because we do not draw lines on single blocks.
       */
      for (let iB = 0; iB < block.length; iB++) {
        this.ctx.fillStyle = fillStyle;
        const dataPoint = block[iB];
        this.ctx.beginPath();

        if (this.showDots) {
          this.ctx.arc(dataPoint.x, dataPoint.y, radius, 0, 2 * Math.PI, false);
          this.ctx.fill();
        } else if (block.length === 1) {
          this.drawSinglePoints(dataPoint, radius);
        }

        if (withRespectToZeroValues && dataPoint.value === 0) {
          /*
           * To help differentiate zero from some other value,
           * paint the dot representing zero as a thin blue halo
           */
          this.ctx.arc(dataPoint.x, dataPoint.y, 1, 0, 2 * Math.PI, false);
          this.ctx.fillStyle = '#c8ddec';
          this.ctx.fill();
        }
        this.ctx.closePath();
      }
    }
  }

  drawSinglePoints(dataPoint: ExpandedMetricDataPoint, radius: number): void {
    this.ctx.fillRect(dataPoint.x, dataPoint.y, radius, radius);
  }
}
