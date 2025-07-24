/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { GetLogMetricAlertsPreviewQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';

export default createResultSubscriptionFactory<GetLogMetricAlertsPreviewQuery, Result<MetricDataSeries>>({
  eventId: 'getLogMetricsAlertPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
