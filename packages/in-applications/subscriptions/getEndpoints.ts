/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { EndpointItem, GetEndpointsQuery, PaginatedResult, Result } from 'in-types';

export default createResultSubscriptionFactory<GetEndpointsQuery, Result<PaginatedResult<EndpointItem>>>({
  eventId: 'getEndpoints',
  trackSubscriptionStatistics: true
});
