/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CursorPaginatedResult, GetWebsiteBeaconGroupsQuery, Result, WebsiteBeaconGroupsItem } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetWebsiteBeaconGroupsQuery,
  Result<CursorPaginatedResult<WebsiteBeaconGroupsItem>>
>({
  eventId: 'getWebsiteBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
