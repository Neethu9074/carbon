import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-trace',

  // getID
  traceId => traceId,

  // data to be send for subscription
  (subscriptionId, traceId) => {
    return {
      subscriptionId,
      traceId
    };
  },

  // data transformation on onData
  trace => Immutable.fromJS(trace)
);
