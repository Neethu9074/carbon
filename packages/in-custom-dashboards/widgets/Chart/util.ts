/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { getUnit } from 'in-stores/metric/units';
import { t } from 'in-i18n';

export function getShortMetricKey(axisName: string, indexInAxis: number): string {
  return `${axisName.toUpperCase()}.${indexInAxis + 1}`;
}

export function getMetricLabel(metric: Metric, hasGroups: boolean = false): string {
  if (metric.label) {
    return metric.label;
  }

  if (metric.metricLabel) {
    return hasGroups ? 'no_group' : metric.metricLabel;
  }

  if (metric.metric) {
    return metric.metric;
  }

  return t('in-custom-dashboards:widgets.util.unnamMetric');
}

export function getMetricUnit(metric: Metric): string {
  if (metric.unit) {
    return getUnit(metric.unit)?.label;
  }
  return 'Unknown';
}

export function getMetricId(metricIndex: number): string {
  return `custom-dashboard-chart-widget-metric-${metricIndex}`;
}

interface Props extends Pick<Metric, 'label'> {
  metric: string;
}

/**
 * Finds duplicated metric labels within an array of metrics.
 * It considers only one word label (i.e Used). Sometimes the information is already in the label (i.e Memory Used), this is why only one word is considered.
 * This function will find duplicates based on the label and the getUniqueMetricsLabels will append the metric category.
 * @param metrics - An array of partial Metric objects.
 * @returns An array of duplicated labels.
 */
export function findDuplicatedMetricsLabels(metrics: Partial<Metric>[]): string[] {
  const singleWordLabels = metrics
    .filter(({ label }) => label && label.split(' ').length === 1)
    .map<string>(({ label }) => label!);

  const labelCounts = singleWordLabels.reduce<Record<string, number>>((counts, label) => {
    counts[label] = (counts[label] || 0) + 1;
    return counts;
  }, {});

  return Object.keys(labelCounts).filter(label => labelCounts[label] > 1);
}

/**
 * Generates an array of unique metric labels, modifying duplicates with metric category.
 *
 * @param metrics - An array of Props objects containing label and metric properties.
 * @returns An array of unique labels with modified duplicates.
 */
export function getUniqueMetricsLabels(metrics: Props[]) {
  const duplicatedMetrics = findDuplicatedMetricsLabels(metrics);

  return metrics.map(({ label, metric }) => {
    if (label) {
      const metricName = metric.split('.')[0];
      const metricCategory = metricName.charAt(0).toUpperCase() + metricName.slice(1);

      const duplicatesWithSameMetric = metrics.filter(m => m.label === label && m.metric !== metric);
      if (duplicatesWithSameMetric.length > 0 && duplicatedMetrics.includes(label)) {
        return `${label} (${metricCategory})`;
      }
    }

    return label;
  });
}

/**
 * Removes duplicates from an array of objects based on specified properties.
 *
 * @param array - An array of objects of type T.
 * @param properties - An array of property keys to determine duplicates.
 * @returns A new array containing unique objects based on the specified properties.
 */
export function removeDuplicatesFromArrayObjects<T>(array: T[], properties: Array<keyof T>): T[] {
  const seen = new Set<string>();
  const uniqueArray: T[] = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const propValues: string[] = [];

    for (const key of properties) {
      propValues.push(String(item[key]));
    }

    const propValuesString = propValues.join('-');

    if (!seen.has(propValuesString)) {
      seen.add(propValuesString);
      uniqueArray.push(item);
    }
  }

  return uniqueArray;
}
