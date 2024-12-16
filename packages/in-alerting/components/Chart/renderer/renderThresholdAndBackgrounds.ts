/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { themes } from '@instana/design-tokens';

import { renderPredictions } from 'in-alerting/components/Chart/renderer/renderPredictions';
import { isEmpty } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { DataSeries, RenderConfig } from 'in-components/Chart/renderer/types';
import { MetricDataSeries } from 'in-components/Chart/types';
import { hexToRGBA } from 'in-services/formatters/color';
import { AxisColor } from 'in-components/Chart/types';
import line from 'in-components/Chart/renderer/line';
import { ScaleType } from 'in-services/scale';

const defaultThresholdLineWidth = 1;

function renderBackground(
  xStart: number,
  xEnd: number,
  yStart: number,
  timebasePoints: DataSeries,
  fillStyle: string,
  scale: ScaleType,
  config: RenderConfig
) {
  const { backBufferCtx } = config;

  backBufferCtx.save();
  backBufferCtx.fillStyle = fillStyle;

  backBufferCtx.beginPath();
  backBufferCtx.moveTo(xStart, scale.getRange(timebasePoints[0][1]));

  drawLineGraph(timebasePoints.length, config, timebasePoints, scale);

  backBufferCtx.lineTo(xEnd, yStart);
  backBufferCtx.lineTo(xStart, yStart);
  backBufferCtx.closePath();
  backBufferCtx.fill();
  backBufferCtx.restore();
}

function renderBackgroundWithGaps(
  segments: DataSeries[],
  yStart: number,
  fillStyle: string,
  scale: ScaleType,
  config: RenderConfig
) {
  segments.forEach(timebasePoints => {
    const { xScaleBackBuffer } = config;
    const xStart = xScaleBackBuffer.getRange(timebasePoints[0][0]);
    const xEnd = xScaleBackBuffer.getRange(timebasePoints[timebasePoints.length - 1][0]);

    renderBackground(xStart, xEnd, yStart, timebasePoints, fillStyle, scale, config);
  });
}

export function calculateSegments(timebasePoints: DataSeries, maxDistanceBetweenDatapointsInMillis: number) {
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

function drawLineGraph(len: number, config: RenderConfig, metric: DataSeries, scale: ScaleType): void {
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
): void {
  const len = oneSidedThresholdInTimeframe.length;

  if (len === 0) {
    return;
  }

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
  renderBackgroundWithGaps(
    segments,
    config.markerPaneHeight,
    isGreaterOp ? violationColor : alrightColor,
    scale,
    config
  );

  // one-sided time-dependent threshold line
  drawThresholdLine(oneSidedThresholdInTimeframe, thresholdColor, config, scale);
}

// draw one-sided time-dependent threshold line
export function drawThresholdLine(dataSeries: DataSeries, color: string, config: RenderConfig, scale: ScaleType) {
  const { backBufferCtx, y1 } = config;

  backBufferCtx.save();
  line.render({
    dataSeries: dataSeries,
    color: color,
    scale,
    config: {
      ...config,
      y1: {
        ...y1,
        lineWidth: defaultThresholdLineWidth
      }
    }
  });
  backBufferCtx.restore();
}

export function renderStaticThresholdLineAndBackgrounds(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  thresholdValue: number,
  isGreaterOp: boolean,
  metrics: MetricDataSeries[],
  displayPredictions?: boolean
): void {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer } = config;

  // @ts-expect-error scales is not yet defined on config
  const yScale: ScaleType = config.scales.y1;

  const chartHeight = scale.getRangeFrom();
  const chartWidth = xScaleBackBuffer.getRangeTo();
  const threshold = yScale.getRangeFrom() - yScale.getRange(thresholdValue);
  const thresholdColor = colors100[1]!;
  const alrightColor = colors50[0]!;
  const violationColor = colors50[1]!;

  backBufferCtx.save();
  // Background above line
  backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
  backBufferCtx.fillRect(0, markerPaneHeight, chartWidth, chartHeight - threshold - markerPaneHeight!);

  // Background below line
  backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
  backBufferCtx.fillRect(0, chartHeight - threshold, chartWidth, threshold);

  // if displayPredictions is true, render predictions to the chart along with lowerbound and upperbound
  if (displayPredictions) {
    renderPredictions(config, metrics, scale);
    // SetLineDash to [] to display a regular line for threshold and a line chart for historical data, since we render dotted line for predictions.
    backBufferCtx.setLineDash([]);
  }

  // static horizontal line
  drawStaticHorizontalLine(backBufferCtx, chartHeight, threshold, thresholdColor, chartWidth);
}

/**
 * Render a filled box.
 */
export function renderHighlight(config: RenderConfig, scale: ScaleType, highlight: Highlight): void {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer } = config;

  const { area, color } = highlight;

  if (!area) {
    return;
  }

  const { start, end } = area;

  if (start && end) {
    const chartHeight = scale.getRangeFrom();
    const height = chartHeight - markerPaneHeight;
    const y = markerPaneHeight;

    const startX = xScaleBackBuffer.getRange(start);
    const endX = xScaleBackBuffer.getRange(end);

    backBufferCtx.fillStyle = color[0];
    backBufferCtx.save();
    backBufferCtx.strokeStyle = color[1];
    backBufferCtx.lineWidth = 0.5;
    backBufferCtx.fillRect(startX, y, endX - startX, height);

    // draw the boundaries as vertical lines:
    [startX, endX].forEach(x => {
      backBufferCtx.beginPath();
      backBufferCtx.moveTo(x, y);
      backBufferCtx.lineTo(x, y + height);
      backBufferCtx.stroke();
    });
    backBufferCtx.restore();
  }
}

export interface Highlight {
  area?: {
    /** the start x coordinate (in the metrics x range) */
    start?: number;
    /** the end x coordinate (in the metrics x range) */
    end?: number;
  };
  /**
   * a pair of colors
   * - Index 0 being the highlights fill color and
   * - index 1 being its border color.
   */
  color: string[];
  label: string;
}

// grey out portion of background for which no metric data is available
export function renderGreyAreaAsMetricUnavailableIndicator(
  config: RenderConfig,
  graphAreaHeight: number,
  lastAvailableThresholdTimestamp: number,
  lastAvailableMetricTimestamp: number
) {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer } = config;

  const xStart = xScaleBackBuffer.getRange(lastAvailableMetricTimestamp);
  const xPosEnd = xScaleBackBuffer.getRange(lastAvailableThresholdTimestamp);

  backBufferCtx.save();
  backBufferCtx.fillStyle = hexToRGBA(themes.default.ids.color.option.neutral['600'], 0.15);
  backBufferCtx.fillRect(xStart, markerPaneHeight, xPosEnd - xStart, graphAreaHeight);
  backBufferCtx.restore();
}

function drawStaticHorizontalLine(
  backBufferCtx: CanvasRenderingContext2D,
  chartHeight: number,
  threshold: number,
  thresholdColor: string,
  chartWidth: number
) {
  backBufferCtx.beginPath();
  backBufferCtx.moveTo(0, chartHeight - threshold);
  backBufferCtx.lineWidth = defaultThresholdLineWidth;
  backBufferCtx.strokeStyle = thresholdColor;
  backBufferCtx.lineTo(chartWidth, chartHeight - threshold);
  backBufferCtx.stroke();
  backBufferCtx.restore();
}

function getBgAreaDetails(
  config: RenderConfig,
  scale: ScaleType,
  warningThresholdValue: number | undefined,
  criticalThresholdValue: number | undefined,
  colors50: AxisColor[]
) {
  const { markerPaneHeight, xScaleBackBuffer } = config;

  // @ts-expect-error scales is not yet defined on config
  const yScale: ScaleType = config.scales.y1;
  const chartHeight = scale.getRangeFrom();
  const chartWidth = xScaleBackBuffer.getRangeTo();
  const warningThreshold = yScale.getRangeFrom() - yScale.getRange(warningThresholdValue!);
  const criticalThreshold = yScale.getRangeFrom() - yScale.getRange(criticalThresholdValue!);

  const alrightColor = colors50[0]!;
  const warningViolationColor = colors50[1]!;
  const criticalViolationColor = colors50[2]!;

  const bgAreasForGreaterOperator: BackgroundArea[] = [
    {
      y: markerPaneHeight,
      width: chartWidth,
      height: chartHeight - criticalThreshold - markerPaneHeight!,
      color: criticalViolationColor
    },
    {
      y: chartHeight - criticalThreshold,
      width: chartWidth,
      height: criticalThreshold - warningThreshold,
      color: warningViolationColor
    },
    {
      y: chartHeight - warningThreshold,
      width: chartWidth,
      height: warningThreshold,
      color: alrightColor
    }
  ];

  const bgAreasForLessOperator: BackgroundArea[] = [
    {
      y: markerPaneHeight,
      width: chartWidth,
      height: chartHeight - warningThreshold - markerPaneHeight!,
      color: alrightColor
    },
    {
      y: chartHeight - warningThreshold,
      width: chartWidth,
      height: warningThreshold - criticalThreshold,
      color: warningViolationColor
    },
    {
      y: chartHeight - criticalThreshold,
      width: chartWidth,
      height: criticalThreshold,
      color: criticalViolationColor
    }
  ];

  return {
    bgAreasForGreaterOperator,
    bgAreasForLessOperator
  };
}

export function renderMultiStaticThresholdLinesAndBackgrounds(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  warningThresholdValue: number | undefined,
  criticalThresholdValue: number | undefined,
  isGreaterOp: boolean
): void {
  const isWarningThresholdDefined = !isEmpty(warningThresholdValue);
  const isCriticalThresholdDefined = !isEmpty(criticalThresholdValue);

  if (!isWarningThresholdDefined && !isCriticalThresholdDefined) {
    return;
  }

  if (isWarningThresholdDefined && !isCriticalThresholdDefined) {
    renderStaticThresholdLineAndBackgrounds(
      config,
      scale,
      colors50,
      colors100,
      warningThresholdValue!,
      isGreaterOp,
      []
    );
    return;
  } else if (!isWarningThresholdDefined && isCriticalThresholdDefined) {
    renderStaticThresholdLineAndBackgrounds(
      config,
      scale,
      colors50,
      colors100,
      criticalThresholdValue!,
      isGreaterOp,
      []
    );
    return;
  }

  if (
    (isGreaterOp && criticalThresholdValue! < warningThresholdValue!) ||
    (!isGreaterOp && warningThresholdValue! < criticalThresholdValue!)
  ) {
    return;
  }

  const { backBufferCtx, xScaleBackBuffer } = config;
  backBufferCtx.save();

  const { bgAreasForGreaterOperator, bgAreasForLessOperator } = getBgAreaDetails(
    config,
    scale,
    warningThresholdValue,
    criticalThresholdValue,
    colors50
  );

  const bgAreas = isGreaterOp ? bgAreasForGreaterOperator : bgAreasForLessOperator;
  bgAreas.forEach(area => drawBackgroundArea(area, backBufferCtx));

  const warningThresholdColor = colors100[1]!;
  const criticalThresholdColor = colors100[2]!;
  const chartHeight = scale.getRangeFrom();
  const chartWidth = xScaleBackBuffer.getRangeTo();
  // @ts-expect-error scales is not yet defined on config
  const yScale: ScaleType = config.scales.y1;
  const warningThreshold = yScale.getRangeFrom() - yScale.getRange(warningThresholdValue!);
  const criticalThreshold = yScale.getRangeFrom() - yScale.getRange(criticalThresholdValue!);

  // static horizontal line
  drawStaticHorizontalLine(backBufferCtx, chartHeight, warningThreshold, warningThresholdColor, chartWidth);
  drawStaticHorizontalLine(backBufferCtx, chartHeight, criticalThreshold, criticalThresholdColor, chartWidth);
}

interface BackgroundArea {
  y: number;
  width: number;
  height: number;
  color: string;
}

export function drawBackgroundArea(
  { y, width, height, color }: BackgroundArea,
  backBufferCtx: CanvasRenderingContext2D
): void {
  const x = 0;

  backBufferCtx.lineWidth = 0;
  backBufferCtx.fillStyle = color;
  backBufferCtx.fillRect(x, y, width, height);
}
