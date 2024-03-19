/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { MetricDataSeries } from 'in-applications/subscriptions/types';
import { GetLogMetricAlertsPreviewQuery, Result } from 'in-types';

export default createResultSubscriptionFactory<GetLogMetricAlertsPreviewQuery, Result<MetricDataSeries>>({
  eventId: 'getLogMetricsAlertPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
