/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetInfrastructureQuery, InfrastructureItem, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetInfrastructureQuery, Result<PaginatedResult<InfrastructureItem>>>({
  eventId: 'getInfrastructure',
  trackSubscriptionStatistics: true
});
