import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';
import { pendingResult } from 'in-services/fixedObjects';

export default createSubscription({
  eventId: 'subscribe-trace',

  getData(subscriptionId, traceId) {
    return {
      subscriptionId,
      traceId
    };
  },

  transform(observable) {
    return observable.map(fromJS).startWith(fromJS(pendingResult));
  }
});
