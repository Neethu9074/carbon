/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { CursorPaginatedResult } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { LogGroupItem, LogGroupsQuery, Result } from 'in-types';

export interface GetLogGroupsResponse extends Result<CursorPaginatedResult<LogGroupItem>> {}

export default createResultSubscriptionFactory<LogGroupsQuery, GetLogGroupsResponse>({
  eventId: 'logs.getLogGroups'
});
