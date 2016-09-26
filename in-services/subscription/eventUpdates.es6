import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-event-updates',

  getId: () => '',

  getData: (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  transformData: events => Immutable.fromJS(events)
});
