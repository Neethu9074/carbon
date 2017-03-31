import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace',

  getId: traceId => traceId,

  getData: (subscriptionId, traceId) => {
    return {
      subscriptionId,
      traceId,
      offset: 0
    };
  },

  transformData: trace => fromJS(trace)
});
