/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetInfrastructureExploreQuery, InfrastructureItem, PaginatedResult, Result } from 'in-types';
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<
  GetInfrastructureExploreQuery,
  Result<PaginatedResult<InfrastructureItem>>
>({
  eventId: 'infrastructure.getEntities'
});
