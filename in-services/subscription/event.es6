import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-event',

  // getID
  ({eventId, to}) => eventId + ',' + to,

  // data to be send for subscription
  (subscriptionId, {eventId, to}) => {
    return {
      subscriptionId,
      eventId,
      to
    };
  },

  // data transformation on onData
  data => Immutable.fromJS(data)
);
