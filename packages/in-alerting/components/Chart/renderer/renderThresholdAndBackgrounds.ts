/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

// @ts-expect-error is not yet migrated to typescript
import line from 'in-components/Chart/renderer/line';
import { DataSeries, RenderAxis, RenderConfig } from 'in-components/Chart/renderer/types';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { AxisColor } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale/scale';
import { ThresholdOperator } from 'in-types';

export type RenderAxisWithThreshold = RenderAxis & {
  threshold: number;
  operator: ThresholdOperator;
  thresholdLineWidth: number;
};

export function renderBackground(
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
  isGreaterOp: boolean
) {
  const len = oneSidedThresholdInTimeframe.length;

  if (len === 0) {
    return;
  }

  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer, y1 } = config;
  const { thresholdLineWidth } = y1 as RenderAxisWithThreshold;

  const xPosStart = xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[0][0]);
  const xPosEnd = xScaleBackBuffer.getRange(oneSidedThresholdInTimeframe[oneSidedThresholdInTimeframe.length - 1][0]);

  const chartHeight = scale.getRangeFrom();
  const thresholdColor = colors100[1]!;
  const alrightColor = colors50[0]!;
  const violationColor = colors50[1]!;

  // Background below line
  renderBackground(
    xPosStart,
    xPosEnd,
    chartHeight,
    oneSidedThresholdInTimeframe,
    isGreaterOp ? alrightColor : violationColor,
    scale,
    config
  );

  // Background Above line
  renderBackground(
    xPosStart,
    xPosEnd,
    markerPaneHeight,
    oneSidedThresholdInTimeframe,
    isGreaterOp ? violationColor : alrightColor,
    scale,
    config
  );

  // one-sided time-dependent threshold line
  backBufferCtx.save();
  backBufferCtx.lineWidth = thresholdLineWidth;
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

export function renderStaticThresholdLineAndBackgrounds(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[]
) {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer, y1 } = config;
  const { operator, thresholdLineWidth } = y1 as RenderAxisWithThreshold;

  // @ts-expect-error scales is not yet defined on config
  const yScale: ScaleType = config.scales.y1;

  const chartHeight = scale.getRangeFrom();
  const chartWidth = xScaleBackBuffer.getRangeTo();
  const threshold = yScale.getRangeFrom() - yScale.getRange((y1 as RenderAxisWithThreshold)!.threshold);
  const thresholdColor = colors100[1]!;
  const alrightColor = colors50[0]!;
  const violationColor = colors50[1]!;
  const isGreaterOp = operator === undefined || isGreaterOperator(operator);

  backBufferCtx.save();
  // Background above line
  backBufferCtx.fillStyle = isGreaterOp ? violationColor : alrightColor;
  backBufferCtx.fillRect(0, markerPaneHeight, chartWidth, chartHeight - threshold - markerPaneHeight!);

  // Background below line
  backBufferCtx.fillStyle = isGreaterOp ? alrightColor : violationColor;
  backBufferCtx.fillRect(0, chartHeight - threshold, chartWidth, threshold);

  // static horizontal line
  backBufferCtx.beginPath();
  backBufferCtx.moveTo(0, chartHeight - threshold);
  backBufferCtx.lineWidth = thresholdLineWidth;
  backBufferCtx.strokeStyle = thresholdColor;
  backBufferCtx.lineTo(chartWidth, chartHeight - threshold);
  backBufferCtx.stroke();
  backBufferCtx.restore();
}
