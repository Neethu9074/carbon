/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { convertToPercent } from 'in-custom-dashboards/widgets/_shared/formatters';
import { round } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import { defaultFormatter } from 'in-stores/metric/formatters';
import { Threshold, ThresholdOperator } from 'in-types';
import { chartColors } from 'in-themes/chartColors';

export type ThresholdValue = 'normal' | 'warning' | 'critical';
export type ThresholdFn = (value?: number) => ThresholdValue;

type BreachesFn = (threshold: number, value: number) => boolean;
const operatorCheck: Record<ThresholdOperator, BreachesFn> = {
  '>': (threshold: number, value: number) => value > threshold,
  '>=': (threshold: number, value: number) => value >= threshold,
  '<': (threshold: number, value: number) => value < threshold,
  '<=': (threshold: number, value: number) => value <= threshold
};

const breaches = (thresholdOperator: ThresholdOperator, threshold: number, value: number) =>
  !Number.isNaN(threshold) && !Number.isNaN(value) && operatorCheck[thresholdOperator](threshold, value);

export function getThreshold(threshold?: Threshold, formatterId: string = defaultFormatter.id): ThresholdFn {
  return value => {
    if (!threshold || (!value && value !== 0)) {
      return 'normal';
    }
    const { thresholdEnabled, operator, critical, warning } = threshold;
    if (!thresholdEnabled || !operator) {
      return 'normal';
    }
    const currentValue = formatterId.startsWith('percentage') ? convertToPercent(value) : round(value, 2, true);

    if (critical && breaches(operator, round(critical, 2, true), currentValue)) {
      return 'critical';
    } else if (warning && breaches(operator, round(warning, 2, true), currentValue)) {
      return 'warning';
    }
    return 'normal';
  };
}

export function extremeValueInSeries(threshold?: Threshold, series?: number[][]) {
  if (!series || !threshold) {
    return undefined;
  }
  const metricValues = series.map(p => p[1]);
  const { operator } = threshold;
  return operator === '<' || operator === '<=' ? Math.min(...metricValues) : Math.max(...metricValues);
}

// Colors

const strokeColors: Record<ThresholdValue, string | undefined> = {
  normal: undefined,
  warning: chartColors.strokeColors100[9],
  critical: chartColors.strokeColors100[4]
};

const fillColors: Record<ThresholdValue, string | undefined> = {
  normal: undefined,
  warning: chartColors.strokeColors25[9],
  critical: chartColors.strokeColors25[4]
};

export function getThresholdColors(threshold: Threshold, value?: number, formatter?: string) {
  const thresholdLevel = getThreshold(threshold, formatter)(value);
  return { strokeColor: strokeColors[thresholdLevel], fillColor: fillColors[thresholdLevel] };
}

export const humanReadableThresholdOperator = new Map<ThresholdOperator, string>([
  ['>=', '≥'],
  ['>', '>'],
  ['<=', '≤'],
  ['<', '<']
]);
