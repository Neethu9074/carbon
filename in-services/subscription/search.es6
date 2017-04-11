import { List } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-search',

  getId({ query, time, view, timeframe }) {
    return query + time + view + timeframe.to + timeframe.windowSize;
  },

  getData(subscriptionId, { query, time, view, timeframe }) {
    return {
      subscriptionId,
      query,
      time,
      view,
      timeframe
    };
  },

  transformData(data) {
    return List(data);
  }
});
