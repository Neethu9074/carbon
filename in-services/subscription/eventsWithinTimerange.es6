import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-events-within-timerange',

  // getID
  ({eventIds, from, to}) => eventIds.map(id => id + ',') + from + to,

  // data to be send for subscription
  (subscriptionId, {eventIds, to = 0, from}) => {
    return {
      subscriptionId,
      eventIds,
      from,
      to
    };
  },

  // data transformation on onData
  data => Immutable.fromJS(data)
);
