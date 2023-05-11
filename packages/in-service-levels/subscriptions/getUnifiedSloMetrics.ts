/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetUnifiedMetricsQuery, MetricResult, Result } from 'in-types';

const getUnifiedMetricsInternal = createResultSubscriptionFactory<GetUnifiedMetricsQuery, Result<MetricResult[]>>({
  eventId: 'getUnifiedMetrics',
  trackSubscriptionStatistics: true
});

/**
 * We use a custom implementation of getUnifiedMetrics here, because the default one splits the configured metrics in individual
 * subscriptions, while we can batch into a single one since any slo metrics need to be build from the same query anyways.
 * @param metrics
 */
export default function getUnifiedSloMetrics(metrics: GetUnifiedMetricsQuery): Observable<Result<MetricResult[]>> {
  return getUnifiedMetricsInternal(metrics);
}
