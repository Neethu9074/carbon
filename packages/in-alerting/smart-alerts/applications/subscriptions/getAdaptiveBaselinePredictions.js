/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getAdaptiveBaselinePredictions',
  memoizeFor: 0 // because subscribers rely on more than just the
  // latest value (and there is not an easy way to memoize all values of an observable)
  //
  // this did not work as usual: trackSubscriptionStatistics: true
});
