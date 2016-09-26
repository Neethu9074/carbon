import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-open-events',

  getId: time => time,

  getData: (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  transformData: events => Immutable.fromJS(events)
});
