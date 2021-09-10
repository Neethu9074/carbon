/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getSamplingLevel',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

// move out of application
