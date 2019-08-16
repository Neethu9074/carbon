import { defaultMemoize } from 'in-subscription/subscriptionMemoization';
import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';

export function createResultSubscriptionFactory({
  eventId,
  memoizeFor = defaultMemoize,
  disposeSubscriptionOnDocumentHidden = true
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
    }
  });
}
