/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AggregationType, TimeConfig } from '@instana/types';

import { MetricItem } from 'in-infrastructure/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { KpiDefinition } from 'in-sdk/metrics/kpis';

interface OldMetricItem {
  metricId?: string
  aggregationId?: AggregationType
}

type BackwardsCompatibleItem = MetricItem & OldMetricItem

export function fromUrlMetrics({
  urlMetrics,
  kpiDefinitions
}: {
  urlMetrics: BackwardsCompatibleItem[] | undefined;
  kpiDefinitions: KpiDefinition[];
}): MetricItem[] {
  if (urlMetrics === undefined) {
    return kpiDefinitions.map(kpiDefinition => ({
      metric: kpiDefinition.metric,
      aggregation: 'MEAN'
    }))
  }
  return urlMetrics
    .map(m => ({
      metric: m.metric ?? m.metricId,
      aggregation: m.aggregation ?? m.aggregationId ?? 'MEAN'
    }))
    .filter(m => Boolean(m.metric))
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
