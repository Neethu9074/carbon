/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetTechnologyBreakdownQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetTechnologyBreakdownQuery, Result<Record<string, MetricDataSeries>>>({
  eventId: 'getTechnologyBreakdown',
  trackSubscriptionStatistics: true
});
