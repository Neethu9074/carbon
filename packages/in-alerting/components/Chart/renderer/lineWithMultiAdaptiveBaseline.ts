/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderBackgroundsAndLinesWithGapsForMultiThreshold } from 'in-alerting/components/Chart/renderer/renderThresholdsAndBackgroundsForMultiThreshold';
import {
  DataSeries,
  MultiMetricRenderProps,
  RenderAxis,
  RenderConfig,
  Renderer
} from 'in-components/Chart/renderer/types';
import { AdaptiveBaselineFetchedPredictions } from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import { getThresholdInTimeframe } from 'in-alerting/components/Chart/renderer/lineWithAdaptiveBaseline';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { Granularity, ThresholdOperator, ThresholdData, TimeConfig, Severity } from 'in-types';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { AxisColor } from 'in-components/Chart/types';
import line from 'in-components/Chart/renderer/line';
import { ScaleType } from 'in-services/scale/scale';

interface AdaptiveBaselineDataForMultiThreshold extends ThresholdData {
  readonly baseline: BaselineDataSeries;
  readonly deviationFactor: number;
  readonly type: 'adaptiveBaseline';
}
export const createLineWithMultiAdaptiveBaseline = (
  operator: ThresholdOperator,
  warningThreshold: AdaptiveBaselineDataForMultiThreshold | undefined,
  criticalThreshold: AdaptiveBaselineDataForMultiThreshold | undefined,
  granularity: Granularity,
  eventBasedAdaptiveBaseline?: AdaptiveBaselineFetchedPredictions, // undefined - when not in events/alert-details view
  timeConfig?: TimeConfig
): Renderer<MultiMetricRenderProps> => {
  return {
    render: ({ colors50, colors100, scale, config, metrics }): void => {
      const metric = metrics[0];

      renderMultiAdaptiveBaseline(
        config,
        scale,
        operator,
        warningThreshold,
        criticalThreshold,
        granularity,
        colors50,
        colors100,
        eventBasedAdaptiveBaseline,
        timeConfig
      );

      // historical data
      line.render({ dataSeries: metric, color: colors100[0]!, scale, config });
    },
    enrich: (_config: unknown, axis: RenderAxis) => {
      axis.valuesDependOnEachOther = true;
    }
  };
};

function extractBaselineData(
  warningBaselineData: AdaptiveBaselineDataForMultiThreshold | undefined,
  criticalBaselineData: AdaptiveBaselineDataForMultiThreshold | undefined
): {
  baseline: BaselineDataSeries;
  warningSensitivity?: number;
  criticalSensitivity?: number;
} {
  return {
    baseline: warningBaselineData?.baseline ?? criticalBaselineData?.baseline ?? [],
    warningSensitivity: warningBaselineData?.deviationFactor,
    criticalSensitivity: criticalBaselineData?.deviationFactor
  };
}

function renderMultiAdaptiveBaseline(
  config: RenderConfig,
  scale: ScaleType,
  operator: ThresholdOperator,
  warningBaselineData: AdaptiveBaselineDataForMultiThreshold | undefined,
  criticalBaselineData: AdaptiveBaselineDataForMultiThreshold | undefined,
  granularity: Granularity,
  colors50: AxisColor[],
  colors100: AxisColor[],
  eventBasedAdaptiveBaseline?: AdaptiveBaselineFetchedPredictions,
  timeConfig?: TimeConfig
): void {
  const { baseline, warningSensitivity, criticalSensitivity } = extractBaselineData(
    warningBaselineData,
    criticalBaselineData
  );
  const isGreaterOp = isGreaterOperatorOrUndefined(operator);

  const thresholdInTimeframeForWarning: DataSeries =
    warningSensitivity != null
      ? calculateThresholdInTimeframeForSeveity(
          WARNING_SEVERITY,
          baseline,
          warningSensitivity,
          isGreaterOp,
          granularity,
          eventBasedAdaptiveBaseline,
          timeConfig
        )
      : [];
  const thresholdInTimeframeForCritical: DataSeries =
    criticalSensitivity != null
      ? calculateThresholdInTimeframeForSeveity(
          CRITICAL_SEVERITY,
          baseline,
          criticalSensitivity,
          isGreaterOp,
          granularity,
          eventBasedAdaptiveBaseline,
          timeConfig
        )
      : [];

  const withGaps = true;
  renderBackgroundsAndLinesWithGapsForMultiThreshold(
    config,
    scale,
    colors50,
    colors100,
    thresholdInTimeframeForWarning,
    thresholdInTimeframeForCritical,
    isGreaterOp,
    withGaps
  );
}

export function calculateThresholdInTimeframeForSeveity(
  severity: Severity,
  baseline: BaselineDataSeries,
  sensitivity: number,
  isGreaterOp: boolean,
  granularity: Granularity,
  baselineEntriesFromMetadata?: AdaptiveBaselineFetchedPredictions,
  timeConfig?: TimeConfig
): DataSeries {
  if (baselineEntriesFromMetadata === undefined) {
    // we're not in alert-details or events view
    return getThresholdInTimeframe([], baseline, sensitivity, isGreaterOp, granularity, timeConfig);
  }

  const thresholdInTimeframe: DataSeries = [];

  for (const [timestamp, warningPrediction, criticalPrediction] of baselineEntriesFromMetadata) {
    thresholdInTimeframe.push([
      Number(timestamp),
      severity === WARNING_SEVERITY ? warningPrediction : criticalPrediction
    ]);
  }
  return thresholdInTimeframe;
}
