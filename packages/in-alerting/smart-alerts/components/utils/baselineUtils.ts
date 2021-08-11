/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ThresholdOperator, ThresholdType } from 'in-types';
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

export interface AlertConfig {
  threshold: {
    operator: ThresholdOperator;
    baseline: number[][];
    deviationFactor: number;
  };
  granularity: number;
}

export function getApproximatedHistoricBaselineThresholdValue(alertConfig: AlertConfig, timeConfig: FixedTimeConfig) {
  const { operator, baseline, deviationFactor } = alertConfig.threshold;
  const baselineGranularity = alertConfig.granularity;
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
  alertConfig: AlertConfig,
  adaptiveBaselineInfo: Record<string, number>
) {
  const { operator } = alertConfig.threshold;
  const isGreaterOp = operator === '>=' || operator === '>';
  const baselineValues = Object.values(adaptiveBaselineInfo);

  return isGreaterOp ? Math.floor(Math.min(...baselineValues)) : Math.ceil(Math.max(...baselineValues));
}

export function isHistoricBaseline(baseline?: ThresholdType): boolean {
  return baseline === HISTORIC_BASELINE;
}
