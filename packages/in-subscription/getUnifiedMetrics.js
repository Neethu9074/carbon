import { combineLatest } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { merge } from 'in-subscription/getUnifiedMetricsMerger';

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

  return combineLatest(observables).map(merge);
}
