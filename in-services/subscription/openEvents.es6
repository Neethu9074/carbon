import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-open-events',

  // getID
  () => '',

  // data to be send for subscription
  subscriptionId => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  events => Immutable.fromJS(events)
);
