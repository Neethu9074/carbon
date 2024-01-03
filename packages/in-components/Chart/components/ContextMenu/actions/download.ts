/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AxisConfiguration, MetricDataSeries } from 'in-components/Chart/types';
import { HighlightedTimeframe } from 'in-stores/highlightedTimeframe';

export interface InputMetrics {
  y1: AxisConfiguration;
  cardTitle: string;
}

export interface MetricData {
  timestamp: number;
  value: number;
}
export type Metrics = { [series: string]: MetricData[] };

export function metricsFilteredOnHighlightedTimeframe(
  metrics: InputMetrics,
  highlightedTimeframe: HighlightedTimeframe
): Metrics {
  return filterOnHighlightedTimeframe(
    highlightedTimeframe,
    groupMetricsBySeries(metrics.y1.labels, metrics.y1.metrics)
  );
}

function filterOnHighlightedTimeframe(highlightedTimeframe: HighlightedTimeframe, metrics: Metrics): Metrics {
  if (!highlightedTimeframe) {
    return metrics;
  }

  const from = highlightedTimeframe[0];
  let to = highlightedTimeframe[1];

  const series = Object.keys(metrics);
  for (const label of series) {
    metrics[label] = metrics[label].filter(({ timestamp }) => timestamp >= from && timestamp <= to);
  }

  return metrics;
}

function groupMetricsBySeries(labels: string[], metricValuesForDownload: MetricDataSeries[]): Metrics {
  const values: Metrics = {};
  for (let i = 0; i < labels.length; i++) {
    values[labels[i]] = getMetricData(metricValuesForDownload[i]);
  }
  return values;
}

function getMetricData(metricValues: MetricDataSeries): MetricData[] {
  return metricValues.map(v => ({ timestamp: v[0], value: v[1] }));
}

export function getName(metrics: InputMetrics): string {
  return metrics.cardTitle ?? 'metrics';
}
