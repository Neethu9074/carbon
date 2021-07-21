/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { onStart, onStop, onData } from 'in-services/tracking/ineum/resultSubscriptionStatsTracking';
import { defaultMemoize } from 'in-subscription/subscriptionMemoization';
import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';

export function createResultSubscriptionFactory({
  eventId,
  mapResult,
  memoizeFor = defaultMemoize,
  disposeSubscriptionOnDocumentHidden = true,
  trackSubscriptionStatistics = false
}) {
  return createSubscription({
    eventId,
    memoizeFor,
    disposeSubscriptionOnDocumentHidden,

    getData(subscriptionId, params) {
      return {
        subscriptionId,
        ...params
      };
    },

    transform(observable) {
      if (mapResult) {
        observable = observable.map(mapResult);
      }
      return observable.map(deepFreeze).startWith(pendingResult);
    },

    onStart: trackSubscriptionStatistics ? onStart : null,
    onStop: trackSubscriptionStatistics ? onStop : null,
    onData: trackSubscriptionStatistics ? onData : null
  });
}
