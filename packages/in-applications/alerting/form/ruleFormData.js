import { operators } from 'in-analyze/applicationFilter';

export const ruleMetricNameOptions = Object.freeze({
  errorRate: Object.freeze([{ value: 'errors', label: 'Errors rate' }]),
  slowness: Object.freeze([{ value: 'latency', label: 'Latency' }]),
  logs: Object.freeze([{ value: 'calls', label: 'Logs count' }])
});

export const ruleAggregationOptions = Object.freeze([
  { value: 'MEAN', label: 'mean' },
  { value: 'MIN', label: 'min' },
  { value: 'P25', label: '25th' },
  { value: 'P50', label: '50th' },
  { value: 'P75', label: '75th' },
  { value: 'P90', label: '90th (recommended)' },
  { value: 'P95', label: '95th' },
  { value: 'P98', label: '98th' },
  { value: 'P99', label: '99th' },
  { value: 'MAX', label: 'max' }
]);

export const ruleAggregationForWeeklySeasonalityOptions = Object.freeze([
  { value: 'MEAN', label: 'mean' },
  { value: 'P50', label: '50th' }
]);

export const ruleLogLevelOptions = Object.freeze([
  { value: 'ERROR', label: 'Error' },
  { value: 'WARN', label: 'Warning' },
  { value: 'ANY', label: 'Error or Warning' }
]);

export const ruleLogMessageOperatorOptions = Object.freeze([
  { value: operators.NOT_EMPTY, label: 'Any' },
  { value: operators.EQUALS, label: 'Equals' },
  { value: operators.CONTAINS, label: 'Contains' },
  { value: operators.STARTS_WITH, label: 'Starts with' },
  { value: operators.ENDS_WITH, label: 'Ends with' }
]);

export function getLogMessageRuleOperatorLabel(value) {
  return ruleLogMessageOperatorOptions.filter(entry => entry.value === value)[0].label;
}

export function getLogLevelRuleOperatorLabel(value) {
  return ruleLogLevelOptions.filter(entry => entry.value === value)[0].label;
}
