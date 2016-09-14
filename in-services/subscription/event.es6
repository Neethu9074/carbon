import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-event',

  // getID
  ({eventId}) => eventId,

  // data to be send for subscription
  (subscriptionId, {eventId}) => {
    return {
      subscriptionId,
      eventId
    };
  },

  // data transformation on onData
  data => Immutable.fromJS(data)
);
