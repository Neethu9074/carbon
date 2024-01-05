/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';
import { Result, GetInfraMetricAlertsPreviewQuery } from 'in-types';

export default createResultSubscriptionFactory<GetInfraMetricAlertsPreviewQuery, Result<MetricDataSeries>>({
  eventId: 'getInfraMetricsAlertPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
