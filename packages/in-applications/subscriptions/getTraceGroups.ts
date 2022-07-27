/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CursorPaginatedResult, GetTraceGroupsQuery, Result, TraceGroupsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetTraceGroupsQuery, Result<CursorPaginatedResult<TraceGroupsItem>>>({
  eventId: 'getTraceGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
