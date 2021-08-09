/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { GetWebsiteQuery, Result, Website } from 'in-types';

export default createResultSubscriptionFactory<GetWebsiteQuery, Result<Website>>({
  eventId: 'getWebsite',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
