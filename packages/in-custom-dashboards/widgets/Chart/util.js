/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function getShortMetricKey(axisName, indexInAxis) {
  return `${axisName.toUpperCase()}.${indexInAxis + 1}`;
}

export function getMetricLabel(metric) {
  if (metric.label) {
    return metric.label;
  }

  if (metric.metric) {
    return metric.metric;
  }

  return 'Unnamed metric';
}

export function getMetricId(metricIndex) {
  return `custom-dashboard-chart-widget-metric-${metricIndex}`;
}
