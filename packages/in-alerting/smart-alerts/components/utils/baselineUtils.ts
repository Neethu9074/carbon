/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  AdaptiveBaselineData,
  Granularity,
  HistoricBaselineData,
  Nullish,
  Result,
  Severity,
  RuleWithThreshold,
  ApplicationAlertRuleUnion,
  AdaptiveBaselineConfig
} from 'in-types';
import {
  AdaptiveBaselineFetchedPredictions,
  AdaptiveBaselinePredictionData
} from 'in-alerting/smart-alerts/data/adaptiveBaselinePredictionInfo';
import { hasError, isLoading } from 'in-services/util/result';
import { FixedTimeConfig } from 'in-stores/time/config';
import { days } from 'in-services/time';

/**
 * Compensate that Unix timestamp zero is on a Thursday, not on a Monday.
 */
const fromMondayToThursdayMillis = days.toMillis(3);

export function getHistoricBaselineValue(
  timestamp: number,
  baseline: number[][],
  sensitivity: number,
  baselineGranularity: number,
  isGreaterOperator: boolean
) {
  const baselineWindowSize = baseline.length * baselineGranularity;
  const baselineIdx = Math.floor(((timestamp + fromMondayToThursdayMillis) % baselineWindowSize) / baselineGranularity);
  const baselineValue = baseline[baselineIdx][1];
  const deviationValue = baseline[baselineIdx][2];
  return isGreaterOperator
    ? baselineValue + sensitivity * deviationValue
    : baselineValue - sensitivity * deviationValue;
}

export function getApproximatedHistoricBaselineThresholdValue(
  threshold: HistoricBaselineData | AdaptiveBaselineData,
  granularity: Granularity,
  timeConfig: FixedTimeConfig
) {
  const { operator, baseline, deviationFactor } = threshold;
  const baselineGranularity = granularity;
  const isGreaterOp = operator === '>=' || operator === '>';

  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    baselineValues.push(getHistoricBaselineValue(time, baseline, deviationFactor, baselineGranularity, isGreaterOp));
  }
  return isGreaterOp ? Math.floor(Math.min(...baselineValues)) : Math.ceil(Math.max(...baselineValues));
}

export function getAdaptiveBaselineValue(
  baselineValue: number,
  deviationValue: number,
  sensitivity: number,
  isGreaterOperator: boolean
) {
  return isGreaterOperator
    ? baselineValue + sensitivity * deviationValue
    : baselineValue - sensitivity * deviationValue;
}

export function getApproximatedAdaptiveBaselineThresholdValue(
  threshold: RuleWithThreshold<ApplicationAlertRuleUnion> | AdaptiveBaselineConfig,
  adaptiveBaselineInfo: Record<string, number>,
  isMultiThreshold?: Boolean
) {
  const operator = isMultiThreshold
    ? (threshold as RuleWithThreshold<ApplicationAlertRuleUnion>).thresholdOperator
    : (threshold as AdaptiveBaselineConfig).operator;
  const isGreaterOp = operator === '>=' || operator === '>';
  const baselineValues = Object.values(adaptiveBaselineInfo);

  return isGreaterOp ? Math.floor(Math.min(...baselineValues)) : Math.ceil(Math.max(...baselineValues));
}

/**
 * @param persistedBaselineResult result from fetching the baseline
 * @param errorFallbackBaseline We use eventBasedAdaptiveBaseline as a fallback. It's possible that errorFallbackBaseline is undefined when we are in alert details view.
 */
export function extractBaselineFromResultsOrUseErrorFallback(
  persistedBaselineResult: Result<[number, number][]> | Nullish,
  errorFallbackBaseline: [number, number][]
): {
  baseline: [number, number][];
  error?: boolean;
} {
  const fetchError = persistedBaselineResult && hasError(persistedBaselineResult);

  if (fetchError) {
    // if a fallback baseline exists, hide the error
    if (errorFallbackBaseline?.length > 0) {
      return { baseline: errorFallbackBaseline };
    }
    return {
      error: fetchError,
      baseline: []
    };
  }

  if (persistedBaselineResult && isLoading(persistedBaselineResult)) {
    return { baseline: [] as [number, number][] };
  }

  let baseline: [number, number][] = persistedBaselineResult?.data ?? [];

  if (baseline?.length < errorFallbackBaseline?.length) {
    baseline = errorFallbackBaseline;
  }
  return { baseline };
}

export const WARNING_SEVERITY: Severity = 'WARNING';
export const CRITICAL_SEVERITY: Severity = 'CRITICAL';

export const severityMap: Record<number, Severity> = {
  5: 'WARNING',
  10: 'CRITICAL'
};

export function extractMultiBaselineFromResultsOrUseErrorFallback(
  persistedBaselineResult: Result<AdaptiveBaselineFetchedPredictions> | Nullish,
  errorFallbackBaseline: Array<[string, AdaptiveBaselinePredictionData]>
): {
  baseline: AdaptiveBaselineFetchedPredictions;
  error?: boolean;
} {
  const fetchError = persistedBaselineResult && hasError(persistedBaselineResult);
  if (fetchError) {
    // if a fallback baseline exists, hide the error
    if (errorFallbackBaseline?.length > 0) {
      return { baseline: transformedFallbackBaseline(errorFallbackBaseline) };
    }
    return {
      error: fetchError,
      baseline: []
    };
  }

  if (persistedBaselineResult && isLoading(persistedBaselineResult)) {
    return { baseline: [] as AdaptiveBaselineFetchedPredictions };
  }

  let baseline: AdaptiveBaselineFetchedPredictions = [];

  if (persistedBaselineResult && persistedBaselineResult.data) {
    baseline =
      errorFallbackBaseline && errorFallbackBaseline.length > persistedBaselineResult.data.length
        ? transformedFallbackBaseline(errorFallbackBaseline)
        : persistedBaselineResult.data;
  }

  return { baseline };
}

export function transformedFallbackBaseline(
  errorFallbackBaseline: Array<[string, AdaptiveBaselinePredictionData]>
): AdaptiveBaselineFetchedPredictions {
  return errorFallbackBaseline.map(([time, data]) => [
    Number(time),
    data.warningPredictionValue,
    data.criticalPredictionValue
  ]);
}
