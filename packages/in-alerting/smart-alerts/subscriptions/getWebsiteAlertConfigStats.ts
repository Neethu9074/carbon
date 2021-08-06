/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, WebsiteAlertStats } from 'in-types';

interface GetWebsiteAlertConfigStatsRequest {}

interface GetWebsiteAlertConfigStatsResponse extends Result<WebsiteAlertStats> {}

export default createResultSubscriptionFactory<GetWebsiteAlertConfigStatsRequest, GetWebsiteAlertConfigStatsResponse>({
  eventId: 'getWebsiteAlertConfigStats',
  trackSubscriptionStatistics: true
});
