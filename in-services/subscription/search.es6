import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-search',

  // getID
  ({query, time, view}) => query + time + view,

  // data to be send for subscription
  (subscriptionId, {query, time, view}) => {
    return {
      subscriptionId,
      query,
      time,
      view
    };
  },

  // data transformation on onData
  data => Immutable.List(data)
);
