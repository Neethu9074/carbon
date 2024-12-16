/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// TODO: use correct types. Ideally one that fits for every kind of widget...
export function hasApplicationMetrics(config: any) {
  return (
    config.metricConfiguration?.source === 'APPLICATION' ||
    Object.values(config).some(
      (value: any) =>
        Array.isArray(value?.metrics) &&
        value.metrics.some((metric: { source: string }) => metric.source === 'APPLICATION')
    )
  );
}
