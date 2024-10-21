/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import {
  Granularity,
  HistoricBaselineData,
  ThresholdOperator,
  TimeConfig,
  ThresholdData,
  Seasonality
} from '@instana/types';

import {
  renderGreyAreaAsMetricUnavailableIndicator,
  renderThresholdLineAndBackgrounds
} from 'in-alerting/components/Chart/renderer/renderThresholdAndBackgrounds';
import { renderBackgroundsAndLinesWithGapsForMultiThreshold } from 'in-alerting/components/Chart/renderer/renderThresholdsAndBackgroundsForMultiThreshold';
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
  thresholdOperator: ThresholdOperator,
  historicBaselineData: HistoricBaselineData,
  thresholdGranularity: Granularity,
  metric?: DataSeries
): void {
  const { markerPaneHeight, timeConfig } = config;
  const { baseline, deviationFactor } = historicBaselineData;

  if (!baseline || baseline.length === 0) {
    return;
  }
  if (baseline && baseline.length > 0 && timeConfig) {
    const isGreaterOp = isGreaterOperatorOrUndefined(thresholdOperator);
    const { oneSidedThresholdInTimeframe } = initOneSidedThreshold(
      baseline as BaselineDataSeries,
      deviationFactor,
      thresholdGranularity,
      timeConfig,
      isGreaterOp
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
  sensitivity: number,
  thresholdGranularity: Granularity,
  timeConfig: TimeConfig,
  isGreaterOP: boolean
): { oneSidedThresholdInTimeframe: DataSeries } {
  const oneSidedThresholdInTimeframe: DataSeries = [];

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
        isGreaterOP
      );
      oneSidedThresholdInTimeframe.push([timestamp, thresholdValue]);
    }
  }
  return { oneSidedThresholdInTimeframe };
}

export interface HistoricBaselineDataForMultiThreshold extends ThresholdData {
  readonly baseline: BaselineDataSeries;
  readonly deviationFactor: number;
  readonly seasonality: Seasonality;
  readonly type: 'historicBaseline';
}

export function renderMultiHistoricBaseline(
  config: RenderConfig,
  scale: ScaleType,
  colors50: AxisColor[],
  colors100: AxisColor[],
  operator: ThresholdOperator,
  warningHistoricBaselineData: HistoricBaselineDataForMultiThreshold | undefined,
  criticalHistoricBaselineData: HistoricBaselineDataForMultiThreshold | undefined,
  thresholdGranularity: Granularity,
  metric?: DataSeries
): void {
  const { markerPaneHeight, timeConfig } = config;
  const { baseline, warningDeviationFactor, criticalDeviationFactor } = extractHistoricBaselineData(
    warningHistoricBaselineData,
    criticalHistoricBaselineData
  );

  if (!baseline || baseline?.length === 0) {
    return;
  }
  if (timeConfig) {
    const isGreaterOp = isGreaterOperatorOrUndefined(operator);

    const oneSidedThresholdInTimeframeForWarning =
      warningDeviationFactor != null
        ? initOneSidedThreshold(baseline, warningDeviationFactor, thresholdGranularity, timeConfig, isGreaterOp)
            .oneSidedThresholdInTimeframe
        : [];

    const oneSidedThresholdInTimeframeForCritical =
      criticalDeviationFactor != null
        ? initOneSidedThreshold(baseline, criticalDeviationFactor, thresholdGranularity, timeConfig, isGreaterOp)
            .oneSidedThresholdInTimeframe
        : [];

    renderBackgroundsAndLinesWithGapsForMultiThreshold(
      config,
      scale,
      colors50,
      colors100,
      oneSidedThresholdInTimeframeForWarning,
      oneSidedThresholdInTimeframeForCritical,
      isGreaterOp
    );

    const definedOneSidedThresholdInTimeframe =
      warningDeviationFactor !== undefined
        ? oneSidedThresholdInTimeframeForWarning
        : oneSidedThresholdInTimeframeForCritical;

    const numOfThresholds = definedOneSidedThresholdInTimeframe.length;
    const numOfMetrics = metric?.length ?? 0;

    if (numOfThresholds > 0 && metric && numOfMetrics > 0) {
      const lastAvailableThresholdTimestamp = definedOneSidedThresholdInTimeframe[numOfThresholds - 1][0];

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

function extractHistoricBaselineData(
  warningHistoricBaselineData: HistoricBaselineDataForMultiThreshold | undefined,
  criticalHistoricBaselineData: HistoricBaselineDataForMultiThreshold | undefined
) {
  return {
    baseline: warningHistoricBaselineData?.baseline ?? criticalHistoricBaselineData?.baseline ?? [],
    warningDeviationFactor: warningHistoricBaselineData?.deviationFactor,
    criticalDeviationFactor: criticalHistoricBaselineData?.deviationFactor
  };
}
