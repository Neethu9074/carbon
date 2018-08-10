import { get } from 'lodash';

import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';
import 'in-subscription/subscription';

export function createResultSubscriptionFactory({ eventId, memoizeFor, disposeSubscriptionOnDocumentHidden = true }) {
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

export function isLiveSubscription(data) {
  return (
    get(data, ['filter', 'timeConfig', 'to'], null) == null && get(data, ['filter', 'timeConfig', 'autoRefresh'], false)
  );
}
