/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { TimeConfig } from '@instana/types';

import { getInfraGranularity } from 'in-stores/metric/metric';
import { KpiDefinition } from 'in-sdk/metrics/kpis';

interface MetricAndAggregation {
  metric: string;
  aggregation: string;
}

export function fromUrlMetrics({
  urlMetrics,
  kpiDefinitions
}: {
  urlMetrics: MetricAndAggregation[];
  kpiDefinitions: KpiDefinition[];
}): MetricAndAggregation[] {
  if (urlMetrics.length == 0) {
    return kpiDefinitions.map(kpiDefinition => ({
      metric: kpiDefinition.metric,
      aggregation: 'MEAN'
    }));
  }
  return urlMetrics;
}

export function getGranularity(timeConfig: TimeConfig) {
  const dataPoints = 10;

  return getInfraGranularity(timeConfig, undefined, dataPoints);
}

export function getMetricKey(...parts: any[]) {
  return parts.filter(p => p !== null && p !== undefined).join('.');
}

export function getSeriesKey(key: string) {
  return key + '.series';
}

export function firstValue(metrics?: Number[][]) {
  if (!metrics) {
    return metrics;
  }

  return metrics[0][1];
}
