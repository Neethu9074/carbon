/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Result, GetRelatedCallsDetailsQuery, CursorPaginatedResult, CallDetailsItem } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetRelatedCallsDetailsResult extends Result<CursorPaginatedResult<CallDetailsItem>> {}

export default createResultSubscriptionFactory<GetRelatedCallsDetailsQuery, GetRelatedCallsDetailsResult>({
  eventId: 'getRelatedCallsDetails',
  trackSubscriptionStatistics: true
});
