/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWebsiteQuery, Result, Website } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWebsiteQuery, Result<Website>>({
  eventId: 'getWebsite',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
