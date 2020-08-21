export const aggregationOptions = Object.freeze([
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

export const metricOptions = Object.freeze([{ value: 'latency', label: 'latency' }]);
