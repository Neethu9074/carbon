/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteRateMetricAlertsPreviewQuery, Result } from 'in-types';
import { ResultMap } from 'in-alerting/smart-alerts/websites/subscriptions/metricResponse';

export default createResultSubscriptionFactory<GetWebsiteRateMetricAlertsPreviewQuery, Result<ResultMap>>({
  eventId: 'getWebsiteRateMetricAlertsPreview',
  trackSubscriptionStatistics: true
});
