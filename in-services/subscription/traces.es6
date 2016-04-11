import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-traces',

  // getID
  maxTimestamp => 'traces' + maxTimestamp + Math.round(Date.now() / 1000),

  // data to be send for subscription
  (subscriptionId, maxTimestamp) => {
    return {
      subscriptionId,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined
    };
  },

  // data transformation on onData
  traceData => Immutable.fromJS(traceData)
);
