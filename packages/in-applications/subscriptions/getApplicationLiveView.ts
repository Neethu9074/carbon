/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetApplicationLiveViewQuery, PaginatedResult, Result, Service } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetApplicationLiveViewQuery, Result<PaginatedResult<Service>>>({
  eventId: 'getApplicationLiveView',
  trackSubscriptionStatistics: true
});
