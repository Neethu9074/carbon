/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getRetention',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});

// TODO move out of application
