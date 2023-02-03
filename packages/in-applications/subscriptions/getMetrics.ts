/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetMetricsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetMetricsQuery, Result<Record<string, MetricDataSeries>>>({
  eventId: 'getMetrics',
  trackSubscriptionStatistics: true
});
