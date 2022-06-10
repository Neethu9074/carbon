/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetCallsQuery, Result, CallItem, CursorPaginatedResult } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetCallsQuery, Result<CursorPaginatedResult<CallItem>>>({
  eventId: 'getCalls',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
