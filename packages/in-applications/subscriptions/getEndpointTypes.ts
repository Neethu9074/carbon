/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetEndpointTypesQuery, Result, EndpointType } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetEndpointTypesQuery, Result<EndpointType[]>>({
  eventId: 'getEndpointTypes',
  trackSubscriptionStatistics: true
});
