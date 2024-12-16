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

export default function getUnifiedSloMetrics(metrics: GetUnifiedMetricsQuery): Observable<Result<MetricResult[]>> {
  return getUnifiedMetricsInternal(metrics);
}
