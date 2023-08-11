/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetMobileAppMetricAlertsPreviewQuery, Result } from 'in-types';

type Tuple = [number, number];
type AlertsPreviewMetrics = Record<string, Tuple[]>;

export default createResultSubscriptionFactory<GetMobileAppMetricAlertsPreviewQuery, Result<AlertsPreviewMetrics>>({
  eventId: 'getMobileAppMetricAlertsPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
