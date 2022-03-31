/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CallGroupsItem, CursorPaginatedResult, GetCallGroupsQuery, Result } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetCallGroupsResult extends Result<CursorPaginatedResult<CallGroupsItem>> {}

export default createResultSubscriptionFactory<GetCallGroupsQuery, GetCallGroupsResult>({
  eventId: 'getCallGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
