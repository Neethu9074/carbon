import { List } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-search',

  getId({ query, time, view, timeframe, restrictResultEntityType }) {
    return query + time + view + timeframe.to + timeframe.windowSize + restrictResultEntityType;
  },

  getData(subscriptionId, { query, time, view, timeframe, restrictResultEntityType }) {
    return {
      subscriptionId,
      query,
      time,
      view,
      timeframe,
      restrictResultEntityType
    };
  },

  transformData(data) {
    return List(data);
  }
});
