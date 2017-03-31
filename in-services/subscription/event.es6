import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-event',

  getId({ eventId }) {
    return eventId;
  },

  getData(subscriptionId, { eventId }) {
    return {
      subscriptionId,
      eventId
    };
  },

  transformData(data) {
    return fromJS(data);
  }
});
