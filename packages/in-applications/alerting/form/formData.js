export const selectOptions = Object.freeze({
  ruleMetricName: {
    errorRate: Object.freeze([{ value: 'errors', label: 'Errors rate' }]),
    slowness: Object.freeze([{ value: 'latency', label: 'Latency' }])
  }
});
