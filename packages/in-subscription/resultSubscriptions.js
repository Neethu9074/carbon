import { tracker } from 'in-services/tracking/ineum/resultSubscriptionStatsTracking';
import { defaultMemoize } from 'in-subscription/subscriptionMemoization';
import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';

export function createResultSubscriptionFactory({
  eventId,
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
      return observable.map(deepFreeze).startWith(pendingResult);
    },

    onStart: trackSubscriptionStatistics ? tracker.onStart : null,
    onStop: trackSubscriptionStatistics ? tracker.onStop : null,
    onData: trackSubscriptionStatistics ? tracker.onData : null
  });
}
