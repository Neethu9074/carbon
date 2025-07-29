/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetInfrastructureExploreQuery, InfrastructureExploreItem, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetInfrastructureExploreQuery,
  Result<PaginatedResult<InfrastructureExploreItem>>
>({
  eventId: 'infrastructure.getEntities'
});
