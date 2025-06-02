/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CursorPaginatedResult, GetTracesQuery, Result, TraceItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetTracesQuery, Result<CursorPaginatedResult<TraceItem>>>({
  eventId: 'getSubtraceList',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
