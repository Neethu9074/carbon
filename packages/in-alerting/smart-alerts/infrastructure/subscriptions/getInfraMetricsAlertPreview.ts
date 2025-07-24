/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, GetInfraMetricAlertsPreviewQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetInfraMetricAlertsPreviewQuery, Result<MetricDataSeries>>({
  eventId: 'getInfraMetricsAlertPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
