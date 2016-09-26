import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-event',

  getId: ({eventId}) => eventId,

  getData: (subscriptionId, {eventId}) => {
    return {
      subscriptionId,
      eventId
    };
  },

  transformData: data => Immutable.fromJS(data)
});
