/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TimeConfig } from '@instana/types';

// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import { defaultNumberOfSuggestedDatapoints } from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { MetricDataPoint, MetricDataSeries } from 'in-components/Chart/types';
import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { getChartGranularity } from 'in-stores/metric';

export function findMinMetricValue(metrics: MetricDataSeries): number {
  return metrics.reduce<number>((acc, [, value], index) => {
    if (index === 0) return value;
    return Math.min(acc, value);
  }, 0);
}

export function findMaxMetricValue(metrics: MetricDataSeries): number {
  return metrics.reduce<number>((acc, [, value]) => {
    return Math.max(acc, value);
  }, -Infinity);
}

export function calculateSloReferenceChartGranularity(
  timeConfig: TimeConfig,
  needsExtraSpace = false,
  minGranularity?: number
): number {
  return getChartGranularity(
    timeConfig,
    defaultNumberOfSuggestedDatapoints * (needsExtraSpace ? 0.5 : 1),
    calculateSloGranularity(timeConfig, minGranularity)
  );
}

export function copyFirstBucketOfSubsequentDataSeries(metrics?: MetricDataSeries[]): MetricDataSeries[] {
  return (metrics ?? []).map<MetricDataSeries>((dataSeries, index, all) => {
    const nextIndex = index + 1;
    if (all.length <= nextIndex) return dataSeries;

    const nextDataSeries = all[nextIndex];
    const firstBucketOfSeries: MetricDataPoint = nextDataSeries[0];

    if (firstBucketOfSeries === undefined) return dataSeries;
    return [...dataSeries, firstBucketOfSeries];
  });
}

export function filterMetricValuesByTime(metricValues: MetricDataSeries[], timeConfig: TimeConfig): MetricDataSeries[] {
  const endTimestamp = timeConfig.to ?? Date.now();
  const startTimestamp = endTimestamp - timeConfig.windowSize;

  return metricValues.map(innerArray => {
    return innerArray.filter(([timestamp]) => {
      return timestamp >= startTimestamp && timestamp <= endTimestamp;
    });
  });
}
