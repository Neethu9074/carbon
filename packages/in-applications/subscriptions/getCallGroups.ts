/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CursorPaginatedResult, GetCallGroupsQuery, MetricResult, Result } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetCallGroupsResult extends Result<CursorPaginatedResult<MetricResult[]>> {}

export default createResultSubscriptionFactory<GetCallGroupsQuery, GetCallGroupsResult>({
  eventId: 'getCallGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
