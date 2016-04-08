import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-foundations',

  // getID
  onlyTracesFasterThan => 'traces' + onlyTracesFasterThan + Math.round(Date.now() / 1000),

  // data to be send for subscription
  (subscriptionId, onlyTracesFasterThan) => {
    return {
      subscriptionId,
      onlyTracesFasterThan: onlyTracesFasterThan > 0 ? onlyTracesFasterThan : undefined
    };
  },

  // data transformation on onData
  traceData => Immutable.fromJS(traceData)
);
