/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { WebsitePaginatedBeaconGroupsItem } from '@instana/types/typeDefinitions';
import { GetWebsitePaginatedBeaconGroupsQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { CursorPaginatedResult, Result } from 'in-types';

export default createResultSubscriptionFactory<
  GetWebsitePaginatedBeaconGroupsQuery,
  Result<CursorPaginatedResult<WebsitePaginatedBeaconGroupsItem>>
>({
  eventId: 'getWebsitePaginatedBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
