/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { PaginatedResult, WebsitePaginatedBeaconGroupsItem } from '@instana/types/typeDefinitions';
import { GetWebsitePaginatedBeaconGroupsQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result } from 'in-types';

export default createResultSubscriptionFactory<
  GetWebsitePaginatedBeaconGroupsQuery,
  Result<PaginatedResult<WebsitePaginatedBeaconGroupsItem>>
>({
  eventId: 'getWebsitePaginatedBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
