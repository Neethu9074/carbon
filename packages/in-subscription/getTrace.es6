import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace',

  getId: traceId => traceId,

  getData: (subscriptionId, traceId) => {
    return {
      subscriptionId,
      traceId
    };
  },

  transform(observable) {
    return observable.map(t => {
      if (t.errors.length > 0) {
        return fromJS({
          errors: t.errors
        });
      }
      return fromJS(t.data);
    });
  }
});
