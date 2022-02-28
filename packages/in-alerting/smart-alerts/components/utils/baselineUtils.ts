/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AdaptiveBaselineData, Granularity, HistoricBaselineData, ThresholdConfig, ThresholdType } from 'in-types';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
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
  threshold: ThresholdConfig,
  adaptiveBaselineInfo: Record<string, number>
) {
  const { operator } = threshold;
  const isGreaterOp = operator === '>=' || operator === '>';
  const baselineValues = Object.values(adaptiveBaselineInfo);

  return isGreaterOp ? Math.floor(Math.min(...baselineValues)) : Math.ceil(Math.max(...baselineValues));
}

export function isHistoricBaseline(type?: ThresholdType): boolean {
  return type === HISTORIC_BASELINE;
}
