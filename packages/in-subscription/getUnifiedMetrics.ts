/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { combineLatest } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { merge } from 'in-services/util/resultMerger';

const getUnifiedMetricsInternal = createResultSubscriptionFactory({
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
export default function getUnifiedMetrics({ metrics }) {
  const observables = Object.keys(metrics).map(metricId =>
    getUnifiedMetricsInternal({
      metrics: {
        [metricId]: metrics[metricId]
      }
    })
  );

  return combineLatest(observables).map(mergeResults);
}

function mergeResults(results) {
  return merge(results, mergeResultData);
}

function mergeResultData(dataSets) {
  const merged = [];
  for (const data of dataSets) {
    merged.push(...data);
  }
  return merged;
}
