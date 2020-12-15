export const timeAggregationOptions = Object.freeze([
  { value: 'MEAN', label: 'mean' },
  { value: 'MIN', label: 'min' },
  { value: 'P25', label: '25th' },
  { value: 'P50', label: '50th' },
  { value: 'P75', label: '75th' },
  { value: 'P90', label: '90th' },
  { value: 'P95', label: '95th' },
  { value: 'P98', label: '98th' },
  { value: 'P99', label: '99th' },
  { value: 'MAX', label: 'max' }
]);

export const sumAggregation = Object.freeze([{ value: 'SUM', label: 'sum' }]);

export const meanAggregation = Object.freeze([{ value: 'MEAN', label: 'mean' }]);

export const metricAggregations = Object.freeze({
  latency: { options: timeAggregationOptions, defaultValue: 'P90' },
  calls: { options: sumAggregation, defaultValue: 'SUM' },
  erroneousCalls: { options: sumAggregation, defaultValue: 'SUM' },
  errors: { options: meanAggregation, defaultValue: 'MEAN' }
});

export const metricOptions = Object.freeze([
  { value: 'latency', label: 'Latency' },
  { value: 'calls', label: 'Call count' },
  { value: 'errors', label: 'Error rate' },
  { value: 'erroneousCalls', label: 'Erroneous calls' }
]);
