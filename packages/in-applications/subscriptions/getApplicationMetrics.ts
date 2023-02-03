/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetApplicationMetricsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetApplicationMetricsQuery, Result<Record<string, MetricDataSeries>>>({
  eventId: 'getApplicationMetrics',
  trackSubscriptionStatistics: true
});
