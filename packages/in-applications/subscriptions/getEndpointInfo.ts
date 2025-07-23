/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Endpoint, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<{ id: string }, Result<Endpoint>>({
  eventId: 'getEndpointInfo',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});
