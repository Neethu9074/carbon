import {List} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-search',

  getId({query, time, view}) {
    return query + time + view;
  },

  getData(subscriptionId, {query, time, view}) {
    return {
      subscriptionId,
      query,
      time,
      view
    };
  },

  transformData(data) {
    return List(data);
  }
});
