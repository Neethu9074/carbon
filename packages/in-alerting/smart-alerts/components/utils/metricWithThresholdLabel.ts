/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { humanReadableThresholdOperator } from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/thresholdFormData';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { NumberFormatterObject } from 'in-services/formatters/number';
import { NumberFormatter } from 'in-services/formatters/number';
import { ThresholdOperator, ThresholdType } from 'in-types';

export function createMetricWithThresholdLabel(
  metricLabel: string,
  thresholdType: ThresholdType,
  value: number,
  metricFormat: NumberFormatter,
  operator: ThresholdOperator
): string {
  if (thresholdType === STATIC_THRESHOLD) {
    // append static threshold with operator and value
    const formattedValue = formatMetricValue(metricFormat, value);
    const humanReadableOperator = humanReadableThresholdOperator(operator);
    return `${metricLabel} ${humanReadableOperator} ${formattedValue}`;
  }

  return metricLabel;
}

function formatMetricValue(metricFormatter: NumberFormatterObject, value: number): string {
  return (metricFormatter.short || metricFormatter.compact)?.(value) ?? value.toString();
}
