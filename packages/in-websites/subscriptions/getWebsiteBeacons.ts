/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, GetWebsiteBeaconsQuery, WebsiteBeaconsItem, CursorPaginatedResult } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteBeaconsQuery,
  Result<CursorPaginatedResult<WebsiteBeaconsItem>>
>({
  eventId: 'getWebsiteBeacons',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
