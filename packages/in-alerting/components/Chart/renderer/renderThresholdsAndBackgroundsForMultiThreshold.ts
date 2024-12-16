/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  calculateSegments,
  drawThresholdLine
} from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { DataSeries, RenderConfig } from 'in-components/Chart/renderer/types';
import { AxisColor } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale/scale';

export function renderBackgroundsAndLinesWithGapsForMultiThreshold(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  warningThresholdDataseries: DataSeries, // thresholdInTimeFrame
  criticalThresholdDataseries: DataSeries,
  isGreaterOp: boolean,
  indicateGaps: boolean = false
) {
  if (warningThresholdDataseries.length === 0 && criticalThresholdDataseries.length === 0) {
    return;
  }
  // @ts-expect-error TS2339: Property 'maxDistanceBetweenDatapointsInMillis' does not exist on type 'RenderConfig'.
  const { maxDistanceBetweenDatapointsInMillis } = config;

  const warningThresholdSegments =
    warningThresholdDataseries.length !== 0 && indicateGaps
      ? calculateSegments(warningThresholdDataseries, maxDistanceBetweenDatapointsInMillis)
      : [warningThresholdDataseries];

  const criticalThresholdSegments =
    criticalThresholdDataseries.length !== 0 && indicateGaps
      ? calculateSegments(criticalThresholdDataseries, maxDistanceBetweenDatapointsInMillis)
      : [criticalThresholdDataseries];

  if (warningThresholdSegments.length === criticalThresholdSegments.length) {
    for (let i = 0; i < warningThresholdSegments.length; i++) {
      renderBackgroundsAndLinesForMultiThreshold(
        config,
        scale,
        colors50,
        colors100,
        isGreaterOp,
        warningThresholdSegments[i],
        criticalThresholdSegments[i]
      );
    }
  } else if (warningThresholdDataseries.length > 0 && criticalThresholdDataseries.length === 0) {
    for (let i = 0; i < warningThresholdSegments.length; i++) {
      renderBackgroundsAndLinesForMultiThreshold(
        config,
        scale,
        colors50,
        colors100,
        isGreaterOp,
        warningThresholdSegments[i],
        []
      );
    }
  } else if (criticalThresholdDataseries.length > 0 && warningThresholdDataseries.length === 0) {
    for (let i = 0; i < criticalThresholdSegments.length; i++) {
      renderBackgroundsAndLinesForMultiThreshold(
        config,
        scale,
        colors50,
        colors100,
        isGreaterOp,
        [],
        criticalThresholdSegments[i]
      );
    }
  } else {
    renderBackgroundsAndLinesForMultiThreshold(
      config,
      scale,
      colors50,
      colors100,
      isGreaterOp,
      warningThresholdDataseries,
      criticalThresholdDataseries
    );
  }
}

function renderBackgroundsAndLinesForMultiThreshold(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  isGreaterOp: boolean,
  warningThresholdDataseries: DataSeries,
  criticalThresholdDataseries: DataSeries
): void {
  if (warningThresholdDataseries.length === 0 && criticalThresholdDataseries.length === 0) {
    return;
  }
  const isBothSeriesDefined = warningThresholdDataseries.length !== 0 && criticalThresholdDataseries.length !== 0;

  const warningThresholdLineColor = colors100[1]!;
  const criticalThresholdLineColor = isBothSeriesDefined ? colors100[2]! : colors100[1]!;

  // Render the background
  renderJustBackgroundsForMultiThreshold(
    config,
    scale,
    colors50,
    warningThresholdDataseries,
    criticalThresholdDataseries,
    isGreaterOp
  );

  if (warningThresholdDataseries.length !== 0) {
    drawThresholdLine(warningThresholdDataseries, warningThresholdLineColor, config, scale);
  }
  if (criticalThresholdDataseries.length !== 0) {
    drawThresholdLine(criticalThresholdDataseries, criticalThresholdLineColor, config, scale);
  }
}

function drawLineGraph(
  len: number,
  config: RenderConfig,
  metric: DataSeries,
  scale: ScaleType,
  reverse: boolean
): void {
  const { backBufferCtx } = config;

  if (reverse) {
    for (let i = 0; i < len; ++i) {
      backBufferCtx.lineTo(
        config.xScaleBackBuffer.getRange(metric[len - i - 1][0]),
        scale.getRange(metric[len - i - 1][1])
      );
    }
  } else {
    for (let i = 0; i < len; ++i) {
      backBufferCtx.lineTo(config.xScaleBackBuffer.getRange(metric[i][0]), scale.getRange(metric[i][1]));
    }
  }
}

function drawPolygonArea(
  xStart: number,
  xEnd: number,
  yStart: number,
  timebasePointsForUpperEdge: DataSeries,
  timebasePointsForLowerEdge: DataSeries,
  fillStyle: string,
  scale: ScaleType,
  config: RenderConfig
): void {
  const { backBufferCtx } = config;

  backBufferCtx.save();
  backBufferCtx.fillStyle = fillStyle;

  backBufferCtx.beginPath();

  // upper polygon
  if (timebasePointsForUpperEdge.length === 0 && timebasePointsForLowerEdge.length !== 0) {
    backBufferCtx.moveTo(xStart, scale.getRange(timebasePointsForLowerEdge[0][1]));
    drawLineGraph(timebasePointsForLowerEdge.length, config, timebasePointsForLowerEdge, scale, false);
    backBufferCtx.lineTo(xEnd, yStart); // yStart would be markerPane height
    backBufferCtx.lineTo(xStart, yStart);
    backBufferCtx.closePath();
    backBufferCtx.fill();
  }

  // lower polygon
  if (timebasePointsForUpperEdge.length !== 0 && timebasePointsForLowerEdge.length === 0) {
    backBufferCtx.moveTo(xStart, scale.getRange(timebasePointsForUpperEdge[0][1]));
    drawLineGraph(timebasePointsForUpperEdge.length, config, timebasePointsForUpperEdge, scale, false);
    backBufferCtx.lineTo(xEnd, yStart);
    backBufferCtx.lineTo(xStart, yStart);
    backBufferCtx.closePath();
    backBufferCtx.fill();
  }

  // middle polygon
  if (timebasePointsForUpperEdge.length !== 0 && timebasePointsForLowerEdge.length !== 0) {
    backBufferCtx.moveTo(xStart, scale.getRange(timebasePointsForLowerEdge[0][1]));
    drawLineGraph(timebasePointsForLowerEdge.length, config, timebasePointsForLowerEdge, scale, false);
    backBufferCtx.lineTo(xEnd, scale.getRange(timebasePointsForUpperEdge[timebasePointsForUpperEdge.length - 1][1]));
    drawLineGraph(timebasePointsForUpperEdge.length, config, timebasePointsForUpperEdge, scale, true);
    backBufferCtx.lineTo(xStart, scale.getRange(timebasePointsForLowerEdge[0][1]));
    backBufferCtx.closePath();
    backBufferCtx.fill();
  }

  backBufferCtx.restore();
}

function renderJustBackgroundsForMultiThreshold(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  warningThresholdDataseries: DataSeries,
  criticalThresholdDataseries: DataSeries,
  isGreaterOp: boolean
) {
  const { xScaleBackBuffer, markerPaneHeight } = config;
  const isWarningThresholdDefined = warningThresholdDataseries.length !== 0;
  const isCriticalThresholdDefined = criticalThresholdDataseries.length !== 0;

  const definedSeries = isWarningThresholdDefined ? warningThresholdDataseries! : criticalThresholdDataseries!;

  const xStart = xScaleBackBuffer.getRange(definedSeries[0][0]);
  const xEnd = xScaleBackBuffer.getRange(definedSeries[definedSeries.length - 1][0]);

  const chartHeight = scale.getRangeFrom();
  const alrightColor = colors50[0]!;
  const warningBGColor = colors50[1]!;
  const criticalBGColor = warningThresholdDataseries.length !== 0 ? colors50[2]! : colors50[1]!;

  // only two area upper and lower just color will vary based on isGreaterOP
  if (isWarningThresholdDefined && !isCriticalThresholdDefined) {
    // lower area
    drawPolygonArea(
      xStart,
      xEnd,
      chartHeight,
      warningThresholdDataseries,
      [],
      isGreaterOp ? alrightColor : warningBGColor,
      scale,
      config
    );
    // upper area
    drawPolygonArea(
      xStart,
      xEnd,
      markerPaneHeight,
      [],
      warningThresholdDataseries,
      isGreaterOp ? warningBGColor : alrightColor,
      scale,
      config
    );
  }
  // only two area upper and lower just color will vary based on isGreaterOP
  if (!isWarningThresholdDefined && isCriticalThresholdDefined) {
    // lower area
    drawPolygonArea(
      xStart,
      xEnd,
      chartHeight,
      criticalThresholdDataseries,
      [],
      isGreaterOp ? alrightColor : criticalBGColor,
      scale,
      config
    );
    // upper area
    drawPolygonArea(
      xStart,
      xEnd,
      markerPaneHeight,
      [],
      criticalThresholdDataseries,
      isGreaterOp ? criticalBGColor : alrightColor,
      scale,
      config
    );
  }
  // three areas in this case
  if (isWarningThresholdDefined && isCriticalThresholdDefined) {
    if (isGreaterOp) {
      // lower area
      drawPolygonArea(xStart, xEnd, chartHeight, warningThresholdDataseries, [], alrightColor, scale, config);
      // middle area
      drawPolygonArea(
        xStart,
        xEnd,
        chartHeight,
        criticalThresholdDataseries,
        warningThresholdDataseries,
        warningBGColor,
        scale,
        config
      );
      // upper area
      drawPolygonArea(xStart, xEnd, markerPaneHeight, [], criticalThresholdDataseries, criticalBGColor, scale, config);
    } else {
      // lower area
      drawPolygonArea(xStart, xEnd, chartHeight, criticalThresholdDataseries, [], criticalBGColor, scale, config);
      // middle area
      drawPolygonArea(
        xStart,
        xEnd,
        chartHeight,
        warningThresholdDataseries,
        criticalThresholdDataseries,
        warningBGColor,
        scale,
        config
      );
      // upper area
      drawPolygonArea(xStart, xEnd, markerPaneHeight, [], warningThresholdDataseries, alrightColor, scale, config);
    }
  }

  config.backBufferCtx.restore();
}
