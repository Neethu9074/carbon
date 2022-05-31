/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { renderStaticThresholdLineAndBackgrounds } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { renderThresholdLineAndBackgrounds } from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { getHistoricBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { isGreaterOperator } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { hexToRGBA } from 'in-services/formatters/color';
import theme from 'in-themes';

/**
 * Renders the historic baseline and the backgrounds above/below. Optionally, if metric parameter is provided,
 * it gets used to render/mark the area without available data.
 */
export function renderHistoricBaseline(config, scale, colors50, colors100, metric) {
  const { markerPaneHeight, timeConfig, y1 } = config;
  const { baseline, operator, sensitivity, thresholdGranularity } = y1;

  if (!baseline || baseline.length === 0) {
    renderStaticThresholdLineAndBackgrounds(config, scale, colors100, colors50);
  }
  if (baseline && baseline.length > 0) {
    const { isGreaterOp, oneSidedThresholdInTimeframe } = initOneSidedThreshold(
      baseline,
      operator,
      sensitivity,
      thresholdGranularity,
      timeConfig
    );

    renderThresholdLineAndBackgrounds(config, scale, colors50, colors100, oneSidedThresholdInTimeframe, isGreaterOp);

    let numOfThresholds = oneSidedThresholdInTimeframe.length;
    let numOfMetrics = metric?.length;

    if (numOfThresholds >= 0 && numOfMetrics >= 0) {
      const lastAvailableThresholdTimestamp = oneSidedThresholdInTimeframe[numOfThresholds - 1][0];

      const chartHeight = scale.getRangeFrom();

      const graphAreaHeight = chartHeight - markerPaneHeight;
      const lastAvailableMetricTimestamp = metric[numOfMetrics - 1][0];

      renderMetricUnavailableIndicator(
        config,
        graphAreaHeight,
        lastAvailableThresholdTimestamp,
        lastAvailableMetricTimestamp
      );
    }
  }
}

export function initOneSidedThreshold(baseline, operator, sensitivity, thresholdGranularity, timeConfig) {
  const baselineWindowSize = (timeConfig.windowSize / thresholdGranularity) * thresholdGranularity;
  const chartFrom = timeConfig.to - baselineWindowSize;
  const chartTo = chartFrom + baselineWindowSize;

  const isGreaterOp = operator === undefined || isGreaterOperator(operator);

  const oneSidedThresholdInTimeframe = [];

  for (let timestamp = chartFrom; timestamp <= chartTo; timestamp += thresholdGranularity) {
    const thresholdValue = getHistoricBaselineValue(
      timestamp,
      baseline,
      sensitivity,
      thresholdGranularity,
      isGreaterOp
    );
    oneSidedThresholdInTimeframe.push([timestamp, thresholdValue]);
  }
  return { isGreaterOp, oneSidedThresholdInTimeframe };
}

// grey out portion of background for which no metric data is available
function renderMetricUnavailableIndicator(
  config,
  graphAreaHeight,
  lastAvailableThresholdTimestamp,
  lastAvailableMetricTimestamp
) {
  const { backBufferCtx, markerPaneHeight, xScaleBackBuffer } = config;

  const xStart = xScaleBackBuffer.getRange(lastAvailableMetricTimestamp);
  const xPosEnd = xScaleBackBuffer.getRange(lastAvailableThresholdTimestamp);

  backBufferCtx.save();
  backBufferCtx.fillStyle = hexToRGBA(theme.lib.colors.N600Light, 0.15);
  backBufferCtx.fillRect(xStart, markerPaneHeight, xPosEnd - xStart, graphAreaHeight);
  backBufferCtx.restore();
}
