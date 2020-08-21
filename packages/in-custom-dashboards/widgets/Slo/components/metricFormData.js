export const timeAggregationOptions = Object.freeze([
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

export const sumAggregation = Object.freeze([{ value: 'SUM', label: 'sum' }]);

export const metricOptions = Object.freeze([
  { value: 'latency', label: 'Latency' },
  { value: 'errors', label: 'Error rate' },
  { value: 'calls', label: 'Call count' },
  { value: 'erroneousCalls', label: 'Erroneous calls' },
  { value: 'http.4xx', label: 'HTTP calls with 4XX responses' },
  { value: 'http.5xx', label: 'HTTP calls with 5XX responses' },
  { value: 'logs.error', label: 'Number of error logs' }
]);
