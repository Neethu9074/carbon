import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';
import { deepFreeze } from 'in-services/util/object';
import 'in-subscription/subscription';

export default createSubscription({
  eventId: 'getPerEndpointTypeSummary',
  disposeSubscriptionOnDocumentHidden: false,

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
