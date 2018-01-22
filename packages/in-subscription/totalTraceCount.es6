import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace-count',

  getId({ timeframe, focusedMoment, query }) {
    return timeframe.to + timeframe.windowSize + focusedMoment + query;
  },

  getData(subscriptionId, { timeframe, focusedMoment, query }) {
    return {
      subscriptionId,
      time: focusedMoment,
      timeframe,
      query
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
