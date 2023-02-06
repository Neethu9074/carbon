/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Granularity, HistoricBaselineData, ThresholdOperator, TimeConfig } from '@instana/types';

import {
  renderGreyAreaAsMetricUnavailableIndicator,
  renderThresholdLineAndBackgrounds
} from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { getHistoricBaselineValue } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { DataSeries, RenderConfig } from 'in-components/Chart/renderer/types';
import { AxisColor } from 'in-components/Chart/types';
import { ScaleType } from 'in-services/scale';

/**
 * DataSeries: array of items of
 * - timestamp
 * - value
 * - deviation
 */
export type BaselineDataSeries = [number, number, number][];

/**
 * Renders the historic baseline and the backgrounds above/below. Optionally, if metric parameter is provided,
 * it gets used to render/mark the area without available data.
 */
export function renderHistoricBaseline(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  historicBaselineData: HistoricBaselineData,
  thresholdGranularity: Granularity,
  metric?: DataSeries
): void {
  const { markerPaneHeight, timeConfig } = config;
  const { baseline, deviationFactor, operator } = historicBaselineData;

  if (!baseline || baseline.length === 0) {
    return;
  }
  if (baseline && baseline.length > 0 && timeConfig) {
    const { isGreaterOp, oneSidedThresholdInTimeframe } = initOneSidedThreshold(
      baseline as BaselineDataSeries,
      operator,
      deviationFactor,
      thresholdGranularity,
      timeConfig
    );

    renderThresholdLineAndBackgrounds(config, scale, colors50, colors100, oneSidedThresholdInTimeframe, isGreaterOp);

    const numOfThresholds = oneSidedThresholdInTimeframe.length;
    const numOfMetrics = metric?.length ?? 0;

    if (numOfThresholds > 0 && metric && numOfMetrics > 0) {
      const lastAvailableThresholdTimestamp = oneSidedThresholdInTimeframe[numOfThresholds - 1][0];

      const chartHeight = scale.getRangeFrom();

      const graphAreaHeight = chartHeight - markerPaneHeight;
      const lastAvailableMetricTimestamp = metric[numOfMetrics - 1][0];

      renderGreyAreaAsMetricUnavailableIndicator(
        config,
        graphAreaHeight,
        lastAvailableThresholdTimestamp,
        lastAvailableMetricTimestamp
      );
    }
  }
}

function initOneSidedThreshold(
  baseline: BaselineDataSeries,
  operator: ThresholdOperator,
  sensitivity: number,
  thresholdGranularity: Granularity,
  timeConfig: TimeConfig
): { isGreaterOp: boolean; oneSidedThresholdInTimeframe: DataSeries } {
  const oneSidedThresholdInTimeframe: DataSeries = [];
  const isGreaterOp = isGreaterOperatorOrUndefined(operator);

  if (timeConfig.to) {
    const baselineWindowSize = (timeConfig.windowSize / thresholdGranularity) * thresholdGranularity;
    const chartFrom = timeConfig.to - baselineWindowSize;
    const chartTo = chartFrom + baselineWindowSize;

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
  }
  return { isGreaterOp, oneSidedThresholdInTimeframe };
}
