/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, LogGroupItem, PaginatedResult, LogGroupsQuery } from 'in-types';

export interface GetLogGroupsResponse extends Result<PaginatedResult<LogGroupItem>> {}

export default createResultSubscriptionFactory<LogGroupsQuery, GetLogGroupsResponse>({
  eventId: 'logs.getLogGroups'
});
