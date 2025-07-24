/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, GetApplicationMetricsAlertPreviewQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<
  GetApplicationMetricsAlertPreviewQuery,
  Result<Record<string, MetricDataSeries>>
>({
  eventId: 'getApplicationMetricsAlertPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
