/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { AggregationType, TimeConfig } from '@instana/types';

import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { MetricDataSeries } from 'in-components/Chart/types';
import { deepCopy } from 'in-services/util/object';

export function normalizeTestMetrics(
  umResults: UnifiedMetricsResult[],
  idRegex = /^test-(\d)-(.+)$/
): MetricDataSeries[] {
  const twGroupedMetrics: Array<MetricDataSeries> = [];

  deepCopy(umResults).forEach(({ id, values }) => {
    const idMatch = id.match(idRegex);

    if (!idMatch) return;

    const [, twIndexStr] = idMatch;
    const twIndex = parseInt(twIndexStr);
    const currentTwGroup = twGroupedMetrics[twIndex] ?? [];
    const testMetrics: MetricDataSeries = (values as MetricDataSeries) ?? [];

    twGroupedMetrics[twIndex] = [...currentTwGroup, ...testMetrics];
  });

  return twGroupedMetrics;
}

export function aggregateTests(
  metrics: MetricDataSeries,
  granularity: number,
  timeWindow: TimeConfig,
  aggregationType: Extract<AggregationType, 'MEAN' | 'SUM'>
): MetricDataSeries {
  const metricsCopy = deepCopy(metrics);
  const timeWindowCopy = deepCopy(timeWindow);
  const { windowSize, to } = timeWindowCopy;
  const endTime = to ?? Date.now();
  const startTime = endTime - windowSize;
  const amountBuckets = Math.ceil(windowSize / granularity);
  const dataPoints = Array(amountBuckets).fill([0, 0, 0]);

  metricsCopy.forEach(([timeStamp, value]) => {
    const timeStampInTw = timeStamp - startTime;
    const bucketIndex = Math.ceil(timeStampInTw / granularity);

    if (timeStampInTw < 0 || bucketIndex >= dataPoints.length) return;

    const bucketTimeStamp = startTime + granularity * bucketIndex;
    const [, bucketValue, count] = dataPoints[bucketIndex];
    const newBucketValue = bucketValue + value;
    dataPoints[bucketIndex] = [bucketTimeStamp, newBucketValue, count + 1];
  });

  return dataPoints
    .filter(([timeStamp]) => timeStamp !== 0)
    .map(([timeStamp, value, count]) => {
      if (aggregationType === 'MEAN') {
        return [timeStamp, value / count];
      }

      return [timeStamp, value];
    });
}
