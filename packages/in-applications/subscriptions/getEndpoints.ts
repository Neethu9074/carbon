/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { EndpointItem, GetEndpointsQuery, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetEndpointsQuery, Result<PaginatedResult<EndpointItem>>>({
  eventId: 'getEndpoints',
  trackSubscriptionStatistics: true
});
