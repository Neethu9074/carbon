/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTagSuggestions',
  memoizeFor: 5000,
  trackSubscriptionStatistics: true
});

// TODO in analyze?
