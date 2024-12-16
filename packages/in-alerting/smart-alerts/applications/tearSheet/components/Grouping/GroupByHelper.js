/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { getFormatter as getBackendFormatter } from 'in-services/formatters/backendFormatter';
import { GROUP_COLORS } from 'in-components/AnalyzeView/utils.ts';
import { getFormatter } from 'in-stores/metric/formatters';

export const isNumberFormatter = formatter => formatter === 'NUMBER';

export const getDetailedMetricTooltipValueFormatter = (customFormatterId, formatter) => {
  if (customFormatterId != null) {
    return getFormatter(customFormatterId);
  }
  return isNumberFormatter(formatter)
    ? getBackendFormatter(formatter).compact
    : getBackendFormatter(formatter).detailed;
};

export const getDetailedMetricTooltipValue = (metric, metricFormatter) => {
  if (metric instanceof Array && metric.length === 1 && metric[0].length === 2) {
    return metricFormatter(metric[0][1]);
  }
  return null;
};

export function defaultColorFunction(_, index) {
  return GROUP_COLORS[index];
}
