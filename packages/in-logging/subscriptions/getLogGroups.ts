/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, LogGroupItem, PaginatedResult, LogGroupsQuery } from 'in-types';

interface GetLogGroupsResponse extends Result<PaginatedResult<LogGroupItem>> {}

export default createResultSubscriptionFactory<LogGroupsQuery, GetLogGroupsResponse>({
  eventId: 'logsV2.getLogGroups'
});
