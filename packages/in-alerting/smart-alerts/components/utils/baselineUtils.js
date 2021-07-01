/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { days } from 'in-services/time';

/**
 * Compensate that Unix timestamp zero is on a Thursday, not on a Monday.
 */
const fromMondayToThursdayMillis = days.toMillis(3);

export function getBaselineValue(timestamp, baseline, sensitivity, baselineGranularity, isGreaterOperator) {
  const baselineWindowSize = baseline.length * baselineGranularity;
  const baselineIdx = Math.floor(((timestamp + fromMondayToThursdayMillis) % baselineWindowSize) / baselineGranularity);
  const baselineValue = baseline[baselineIdx][1];
  const deviationValue = baseline[baselineIdx][2];
  return isGreaterOperator
    ? baselineValue + sensitivity * deviationValue
    : baselineValue - sensitivity * deviationValue;
}

export function getApproximatedBaselineThresholdValue(alertConfig, timeConfig) {
  const { operator, baseline, deviationFactor } = alertConfig.threshold;
  const baselineGranularity = alertConfig.granularity;
  const isGreaterOp = operator === '>=' || operator === '>';

  const baselineValues = [];
  for (let time = timeConfig.to - timeConfig.windowSize; time <= timeConfig.to; time += baselineGranularity) {
    baselineValues.push(getBaselineValue(time, baseline, deviationFactor, baselineGranularity, isGreaterOp));
  }
  return isGreaterOp ? Math.floor(Math.min(...baselineValues)) : Math.ceil(Math.max(...baselineValues));
}
