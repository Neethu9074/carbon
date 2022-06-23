/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

// @ts-expect-error is not yet migrated to typescript
import line from 'in-components/Chart/renderer/line';
import { DataSeries, RenderAxis, RenderConfig } from 'in-components/Chart/renderer/types';
import { AxisColor } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale/scale';
import { ThresholdOperator } from 'in-types';

export type RenderAxisWithThreshold = RenderAxis & {
  threshold: number;
  operator: ThresholdOperator;
  thresholdLineWidth: number;
};

function renderBackground(
  xStart: number,
  xEnd: number,
  yStart: number,
  timebasePoints: DataSeries,
  fillStyle: string,
  scale: ScaleType,
  config: RenderConfig
) {
  config.backBufferCtx.save();
  config.backBufferCtx.fillStyle = fillStyle;

  config.backBufferCtx.beginPath();
  config.backBufferCtx.moveTo(xStart, scale.getRange(timebasePoints[0][1]));

  drawLineGraph(timebasePoints.length, config, timebasePoints, scale);

  config.backBufferCtx.lineTo(xEnd, yStart);
  config.backBufferCtx.lineTo(xStart, yStart);
  config.backBufferCtx.closePath();
  config.backBufferCtx.fill();
  config.backBufferCtx.restore();
}

function renderBackgroundWithGaps(
  segments: DataSeries[],
  yStart: number,
  fillStyle: string,
  scale: ScaleType,
  config: RenderConfig
) {
  segments.forEach(timebasePoints => {
    const xStart = config.xScaleBackBuffer.getRange(timebasePoints[0][0]);
    const xEnd = config.xScaleBackBuffer.getRange(timebasePoints[timebasePoints.length - 1][0]);

    renderBackground(xStart, xEnd, yStart, timebasePoints, fillStyle, scale, config);
  });
}

function calculateSegments(timebasePoints: DataSeries, maxDistanceBetweenDatapointsInMillis: number) {
  const segments: DataSeries[] = [];

  let currentSeg: DataSeries = [];
  let previousDataPoint: [number, number] | undefined;

  function distanceBetweenDataPointsIsTooBig(a: any, b: any) {
    return !a || !b || a[0] - b[0] > maxDistanceBetweenDatapointsInMillis;
  }

  for (let i = 0; i < timebasePoints.length; i++) {
    const dataPoint = timebasePoints[i];
    if (!dataPoint) {
      continue;
    }

    if (previousDataPoint && distanceBetweenDataPointsIsTooBig(dataPoint, previousDataPoint)) {
      if (currentSeg.length > 0) {
        segments.push(currentSeg);
      }
      currentSeg = [dataPoint];
    } else {
      currentSeg.push(dataPoint);
    }

    const nextDataPoint = i < timebasePoints.length ? timebasePoints[i + 1] : undefined;
    if (
      (!previousDataPoint && !nextDataPoint) ||
      (distanceBetweenDataPointsIsTooBig(nextDataPoint, dataPoint) &&
        distanceBetweenDataPointsIsTooBig(dataPoint, previousDataPoint))
    ) {
      // segment with only one item exists - we would render a small circle
      segments.push(currentSeg);
      currentSeg = [];
    }

    previousDataPoint = dataPoint;
  }

  // last item
  if (currentSeg.length > 0) {
    segments.push(currentSeg);
  }

  return segments;
}

function drawLineGraph(len: number, config: RenderConfig, metric: DataSeries, scale: ScaleType) {
  for (let i = 0; i < len; ++i) {
    config.backBufferCtx.lineTo(config.xScaleBackBuffer.getRange(metric[i][0]), scale.getRange(metric[i][1]));
  }
}

export function renderThresholdLineAndBackgrounds(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  oneSidedThresholdInTimeframe: DataSeries,
  isGreaterOp: boolean,
  indicateGaps: boolean = false
) {
  const len = oneSidedThresholdInTimeframe.length;

  if (len === 0) {
    return;
  }

  const { backBufferCtx, markerPaneHeight, y1 } = config;
  const { thresholdLineWidth } = y1 as RenderAxisWithThreshold;

  const chartHeight = scale.getRangeFrom();
  const thresholdColor = colors100[1]!;
  const alrightColor = colors50[0]!;
  const violationColor = colors50[1]!;

  function getSegments() {
    // @ts-expect-error TS2339: Property 'maxDistanceBetweenDatapointsInMillis' does not exist on type 'RenderConfig'.
    const { maxDistanceBetweenDatapointsInMillis } = config;

    return calculateSegments(oneSidedThresholdInTimeframe, maxDistanceBetweenDatapointsInMillis);
  }

  const segments = indicateGaps ? getSegments() : [oneSidedThresholdInTimeframe];

  renderBackgroundWithGaps(segments, chartHeight, isGreaterOp ? alrightColor : violationColor, scale, config);
  renderBackgroundWithGaps(segments, markerPaneHeight, isGreaterOp ? violationColor : alrightColor, scale, config);

  // one-sided time-dependent threshold line
  backBufferCtx.save();
  line.render({
    dataSeries: oneSidedThresholdInTimeframe,
    color: thresholdColor,
    scale,
    config: {
      ...config,
      y1: {
        ...y1,
        lineWidth: thresholdLineWidth
      }
    }
  });
  backBufferCtx.restore();
}
