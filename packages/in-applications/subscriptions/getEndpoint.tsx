/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetEndpointQuery, Result, EndpointItem, PaginatedResult } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetEndpointQuery, Result<PaginatedResult<EndpointItem>>>({
  eventId: 'getEndpoint',
  trackSubscriptionStatistics: true
});
