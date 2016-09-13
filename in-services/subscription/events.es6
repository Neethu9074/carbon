import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-events',

  // getID
  timeframe => timeframe.to + ',' + timeframe.windowSize,

  // data to be send for subscription
  (subscriptionId, timeframe) => {
    return {
      subscriptionId,
      timeframe
    };
  },

  // data transformation on onData
  events => Immutable.fromJS(events)
);
