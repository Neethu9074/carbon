import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-filters',

  // getID
  () => '',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  filters => Immutable.fromJS(filters)
);
