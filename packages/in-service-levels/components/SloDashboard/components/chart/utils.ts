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

interface FindMinMaxMetricValuesOptions {
  withBuffer?: boolean;
}

export function findMinMaxMetricValues(
  metrics: MetricDataSeries,
  { withBuffer }: FindMinMaxMetricValuesOptions = {}
): { min: number; max: number } {
  const minMax = metrics.reduce<{ min: number; max: number }>(
    (acc, [, value], index) => {
      if (index === 0) {
        acc.min = value;
        acc.max = value;
      } else {
        acc.min = Math.min(acc.min, value);
        acc.max = Math.max(acc.max, value);
      }
      return acc;
    },
    { min: Infinity, max: -Infinity }
  );

  if (!withBuffer) return minMax;

  const range = minMax.max - minMax.min;
  const fallbackBuffer = minMax.max * 0.05;
  const buffer = Math.max(range * 0.2, fallbackBuffer);

  return {
    max: minMax.max + buffer,
    min: minMax.min === 0 ? minMax.min : minMax.min - buffer
  };
}

export function findMinMetricValue(metrics: MetricDataSeries): number {
  return metrics.reduce((acc, [, value]) => {
    acc = Math.min(acc, value);

    return acc;
  }, Infinity);
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

export function filterMetricValuesWithinTimeWindow(
  metricValues: MetricDataSeries[],
  timeConfig: TimeConfig
): MetricDataSeries[] {
  const endTimestamp = timeConfig.to ?? Date.now();
  const startTimestamp = endTimestamp - timeConfig.windowSize;

  return metricValues.map(innerArray => {
    return innerArray.filter(([timestamp]) => {
      return timestamp >= startTimestamp && timestamp <= endTimestamp;
    });
  });
}

export const invertSyntheticPercentageMetrics = (metrics: MetricDataSeries[]): MetricDataSeries[] => {
  return metrics.map(dataSeries =>
    dataSeries.map(([timestamp, value]) => [timestamp, Math.round((1 - value) * 100) / 100])
  );
};
