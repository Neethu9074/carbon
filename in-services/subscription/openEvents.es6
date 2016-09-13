import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription(
  // event ID
  'subscribe-open-events',

  // getID
  time => time,

  // data to be send for subscription
  (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  // data transformation on onData
  events => Immutable.fromJS(events)
);
