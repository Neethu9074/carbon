import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-trace',

  // getID
  traceId => traceId,

  // data to be send for subscription
  (subscriptionId, traceId) => {
    return {
      subscriptionId,
      traceId,
      offset: 0
    };
  },

  // data transformation on onData
  trace => Immutable.fromJS(trace)
);
