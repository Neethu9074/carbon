/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteBeaconsForPageLoadQuery, Result, WebsiteMonitoringBeacon } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteBeaconsForPageLoadQuery, Result<WebsiteMonitoringBeacon[]>>({
  eventId: 'getWebsiteBeaconsForPageLoad',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
