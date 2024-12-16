/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest, Observable } from '@instana/observables';

import { GetUnifiedMetricsQuery, HistogramMetricResult, LabeledMetricResult, MetricResult, Result } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { merge } from 'in-services/util/resultMerger';
import { isBlank } from 'in-services/util/string';

export type UnifiedMetricsResult = MetricResult | LabeledMetricResult | HistogramMetricResult;

export function isLabeledMetricResult(resultData: UnifiedMetricsResult): resultData is LabeledMetricResult {
  const possiblyLabeledResult = resultData as LabeledMetricResult;
  return possiblyLabeledResult.label != null && !isBlank(possiblyLabeledResult.label);
}

const getUnifiedMetricsInternal = createResultSubscriptionFactory<
  GetUnifiedMetricsQuery,
  Result<UnifiedMetricsResult[]>
>({
  eventId: 'getUnifiedMetrics',
  trackSubscriptionStatistics: true
});

// Split a single getUnifiedMetrics call into multiple subscriptions.
// Splitting the getUnifiedMetrics call into multiple subscriptions
// improves UI caching. Instead of caching one getUnifiedMetrics call
// for multiple metrics, we cache one getUnifiedMetrics for one metric.
//
// This in turn causes the caching to improve for scenarios where a
// subset of the metrics may change in response to user input.
export default function getUnifiedMetrics(
  { metrics }: GetUnifiedMetricsQuery,
  bulkRequest = false
): Observable<Result<UnifiedMetricsResult[]>> {
  if (bulkRequest) {
    return combineLatest([getUnifiedMetricsInternal({ metrics })]).map(mergeResults);
  }

  const observables = Object.keys(metrics).map(metricId =>
    getUnifiedMetricsInternal({
      metrics: {
        [metricId]: metrics[metricId]
      }
    })
  );

  return combineLatest(observables).map(mergeResults);
}

function mergeResults(results: Result<UnifiedMetricsResult[]>[]) {
  return merge(results, mergeResultData);
}

function mergeResultData(dataSets: UnifiedMetricsResult[][]): UnifiedMetricsResult[] {
  const merged = [];
  for (const data of dataSets) {
    merged.push(...data);
  }
  return merged;
}
