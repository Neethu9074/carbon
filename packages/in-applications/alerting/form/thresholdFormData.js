export const thresholdOperatorOptions = Object.freeze([
  { value: '>=', label: '≥' },
  { value: '>', label: '>' },
  { value: '<=', label: '≤' },
  { value: '<', label: '<' }
]);

export const thresholdTypeOptions = Object.freeze([
  { value: 'staticThreshold', label: 'Static Threshold' },
  { value: 'historicBaseline.DAILY', label: 'Baseline (Daily Seasonality)' },
  { value: 'historicBaseline.WEEKLY', label: 'Baseline (Weekly Seasonality)' }
]);

export function getInitialThresholdType(threshold) {
  return threshold && threshold.type && threshold.type === 'historicBaseline'
    ? `${threshold.type}.${threshold.seasonality}`
    : 'staticThreshold';
}

export const metricNameForAlertType = Object.freeze({
  errorRate: 'errors',
  slowness: 'latency',
  logs: 'calls'
});
