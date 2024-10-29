/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { AggregationType, TimeConfig } from '@instana/types';

import { getCommonFormatterForUnits } from 'in-custom-dashboards/widgets/_shared/formatters';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { MetricItem } from 'in-infrastructure/navigation/paths';
import { getInfraGranularity } from 'in-stores/metric/metric';
import { FormatterFn } from 'in-stores/metric/formatters';
import { KpiDefinition } from 'in-sdk/metrics/kpis';
import { BaseUnit } from 'in-stores/metric/units';

interface OldMetricItem {
  metricId?: string;
  aggregationId?: AggregationType;
}

type BackwardsCompatibleItem = MetricItem & OldMetricItem;

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
    }));
  }

  return urlMetrics
    .map(m => ({
      metric: m.metric ?? m.metricId,
      aggregation: m.aggregation ?? m.aggregationId ?? 'MEAN',
      crossSeriesAggregation: m.crossSeriesAggregation,
      regex: m.regex ?? false,
      label: m.label,
      required: Boolean(m.required)
    }))
    .filter(m => Boolean(m.metric));
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

export function lastValueForMetric(metrics?: Number[][]) {
  if (!metrics) {
    return metrics;
  }
  return metrics[metrics.length - 1][1];
}

export function getMetricValue(kpi: number, formatter: FormatterFn) {
  if (kpi !== undefined && kpi !== null) {
    //checking if kpi is falsy, valid kpi can be 0 as well
    return formatter ? formatter(kpi) : kpi;
  }
  return valueMissingPlaceholder;
}

export function getMetricFormatterFromUnitOrDefault(unit: BaseUnit, defaultFormatter: FormatterFn): FormatterFn {
  return unit ? getCommonFormatterForUnits(unit)[0]?.formatter : defaultFormatter;
}
