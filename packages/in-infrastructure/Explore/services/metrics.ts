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

export function average(series: [number, number][]) {
  if (!series) {
    return undefined;
  }

  const { count, sum } = series.reduce(
    ({ count, sum }, metric) => ({
      count: count + 1,
      sum: sum + metric[1]
    }),
    {
      count: 0,
      sum: 0
    }
  );

  return sum / count;
}

export function getMetricKey(metric: string, aggregation: string) {
  return metric + '.' + aggregation;
}
