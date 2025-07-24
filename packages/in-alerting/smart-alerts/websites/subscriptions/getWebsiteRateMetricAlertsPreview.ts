/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteRateMetricAlertsPreviewQuery, Result } from '@instana/types';

import { ResultMap } from 'in-alerting/smart-alerts/websites/subscriptions/metricResponse';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteRateMetricAlertsPreviewQuery, Result<ResultMap>>({
  eventId: 'getWebsiteRateMetricAlertsPreview',
  trackSubscriptionStatistics: true
});
