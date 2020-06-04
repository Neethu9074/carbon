import { hoursToMillis, minutesToMillis } from 'in-new-components/Alerting/utils/formatUtils';

/**
 * Compensate that Unix timestamp zero is on a Thursday, not on a Monday.
 */
const fromMondayToThursdayMillis = hoursToMillis(3 * 24);

export const baselineGranularity = minutesToMillis(10);

export function getBaselineValue(timestamp, baseline, sensitivity, isGreaterOperator) {
  const baselineWindowSize = baseline.length * baselineGranularity;
  const baselineIdx = Math.floor(((timestamp + fromMondayToThursdayMillis) % baselineWindowSize) / baselineGranularity);
  const baselineValue = baseline[baselineIdx][1];
  const deviationValue = baseline[baselineIdx][2];
  return isGreaterOperator
    ? baselineValue + sensitivity * deviationValue
    : baselineValue - sensitivity * deviationValue;
}
