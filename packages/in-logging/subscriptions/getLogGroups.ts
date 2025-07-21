/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CursorPaginatedResult, LogGroupItem, LogGroupsQuery, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export interface GetLogGroupsResponse extends Result<CursorPaginatedResult<LogGroupItem>> {}

export default createResultSubscriptionFactory<LogGroupsQuery, GetLogGroupsResponse>({
  eventId: 'logs.getLogGroups'
});
