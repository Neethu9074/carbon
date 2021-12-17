/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Endpoint, Result } from 'in-types';

export default createResultSubscriptionFactory<{ id: string }, Result<Endpoint>>({
  eventId: 'getEndpointInfo',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});
