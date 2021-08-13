/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteMetricAlertsPreviewQuery, Result } from 'in-types';

type Tuple = [number, number];
type AlertsPreviewMetrics = Record<string, Tuple[]>;

export default createResultSubscriptionFactory<GetWebsiteMetricAlertsPreviewQuery, Result<AlertsPreviewMetrics>>({
  eventId: 'getWebsiteMetricAlertsPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
