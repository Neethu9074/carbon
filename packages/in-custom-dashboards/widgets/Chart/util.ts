/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { t } from 'in-i18n';

export function getShortMetricKey(axisName: string, indexInAxis: number): string {
  return `${axisName.toUpperCase()}.${indexInAxis + 1}`;
}

export function getMetricLabel(metric: Metric): string {
  if (metric.label) {
    return metric.label;
  }

  if (metric.metricLabel) {
    return metric.metricLabel;
  }

  if (metric.metric) {
    return metric.metric;
  }

  return t('in-custom-dashboards:widgets.util.unnamMetric');
}

export function getMetricId(metricIndex: number): string {
  return `custom-dashboard-chart-widget-metric-${metricIndex}`;
}
