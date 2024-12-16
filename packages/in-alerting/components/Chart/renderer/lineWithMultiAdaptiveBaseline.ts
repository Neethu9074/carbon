/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { renderBackgroundsAndLinesWithGapsForMultiThreshold } from 'in-alerting/components/Chart/renderer/renderThresholdsAndBackgroundsForMultiThreshold';
import {
  extractBaselineForSeverity,
  WARNING_SEVERITY,
  CRITICAL_SEVERITY
} from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import {
  DataSeries,
  MultiMetricRenderProps,
  RenderAxis,
  RenderConfig,
  Renderer
} from 'in-components/Chart/renderer/types';
import { getThresholdInTimeframe } from 'in-alerting/components/Chart/renderer/lineWithAdaptiveBaseline';
import { isGreaterOperatorOrUndefined } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { BaselineDataSeries } from 'in-alerting/components/Chart/renderer/historicBaseline';
import { Granularity, ThresholdOperator, ThresholdData } from 'in-types';
import { AxisColor } from 'in-components/Chart/types';
import line from 'in-components/Chart/renderer/line';
import { ScaleType } from 'in-services/scale/scale';

type MultiThresholdDataSeries = [number, number, number][];

interface AdaptiveBaselineDataForMultiThreshold extends ThresholdData {
  readonly baseline: BaselineDataSeries;
  readonly deviationFactor: number;
  readonly type: 'adaptiveBaseline';
}
export const createLineWithMultiAdaptiveBaseline = (
  operator: ThresholdOperator,
  warningThreshold: AdaptiveBaselineDataForMultiThreshold | undefined,
  criticalThreshold: AdaptiveBaselineDataForMultiThreshold | undefined,
  eventBasedAdaptiveBaseline: MultiThresholdDataSeries,
  granularity: Granularity
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
        eventBasedAdaptiveBaseline,
        granularity,
        colors50,
        colors100
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
  eventBasedAdaptiveBaseline: MultiThresholdDataSeries, // either [number, number, number][] or []
  granularity: Granularity,
  colors50: AxisColor[],
  colors100: AxisColor[]
): void {
  const { baseline, warningSensitivity, criticalSensitivity } = extractBaselineData(
    warningBaselineData,
    criticalBaselineData
  );
  const isGreaterOp = isGreaterOperatorOrUndefined(operator);

  const thresholdInTimeframeForWarning: DataSeries =
    warningSensitivity != null
      ? getThresholdInTimeframe(
          extractBaselineForSeverity(eventBasedAdaptiveBaseline, WARNING_SEVERITY),
          baseline,
          warningSensitivity,
          isGreaterOp,
          granularity
        )
      : [];
  const thresholdInTimeframeForCritical: DataSeries =
    criticalSensitivity != null
      ? getThresholdInTimeframe(
          extractBaselineForSeverity(eventBasedAdaptiveBaseline, CRITICAL_SEVERITY),
          baseline,
          criticalSensitivity,
          isGreaterOp,
          granularity
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
