/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  getFormatterType,
  number,
  NumberFormatter,
  NumberFormatterObject,
  percentage
} from 'in-services/formatters/number';
import { thresholdTypeOptions } from 'in-alerting/smart-alerts/components/dialog/advanced/thresholdFormData';
import { formatMetricValue } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { getMetricDefinition, MetricDefinition } from 'in-sdk/metrics/metrics';
import { deepFreeze } from 'in-services/util/object';
import { Option } from 'in-components/ComboBox';

type ThresholdTypeOptions = readonly Option[];

export const infraThresholdTypeOptions: ThresholdTypeOptions = deepFreeze([
  ...thresholdTypeOptions.filter(option => option.value === STATIC_THRESHOLD)
]);

export function getMetricFormat(formatter: any, value: number): NumberFormatter {
  if (formatter === 'PERCENTAGE') {
    return percentage;
  }

  return value !== Math.floor(value) ? number.forcedDetailed : number.forcedCompact;
}

export function getThresholdTypeOptions(): ThresholdTypeOptions {
  return infraThresholdTypeOptions;
}

export function getMaxMetricValue(isPercentageMetric: boolean) {
  return isPercentageMetric ? 100 : Number.MAX_SAFE_INTEGER;
}

export function getFormatter(entityType?: string, metricName?: string): string {
  if (!entityType || !metricName) {
    return '';
  }
  const metricDefinition = getMetricDefinition(entityType, metricName);
  const formatterName = getFormatterType(
    ((metricDefinition as MetricDefinition)?.formatter as NumberFormatterObject)?.detailed
  );
  return formatterName;
}

export function getMetricUnitPostfix(formatter: string) {
  switch (formatter) {
    case 'MILLIS':
      return 'ms';
    case 'PERCENTAGE':
      return '%';
    case 'NANOS':
      return 'ns';
    default:
      return '';
  }
}

export function getMetricFormatter(value: number, formatter: NumberFormatterObject, type: string) {
  const formatterName = getFormatterType(formatter?.detailed);
  const isPercentage = formatterName === 'PERCENTAGE';
  const isNumber = formatterName === 'NUMBER';
  const hasDecimals = value !== Math.floor(value);

  if (hasDecimals) {
    if (isPercentage) {
      return formatMetricValue(percentage, value);
    } else if (isNumber) {
      return formatMetricValue(number.forcedDetailed, value);
    }
  }

  return type === 'compact' ? formatter.compact?.(value) : formatter.detailed?.(value);
}
