/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, GetInfrastructureGroupsQuery, InfrastructureGroup, CursorPaginatedResult } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetInfrastructureGroupsQuery,
  Result<CursorPaginatedResult<InfrastructureGroup>>
>({
  eventId: 'infrastructure.getGroups'
});
