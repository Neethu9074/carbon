import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshots-in-timeframe',

  getId({ timeframe, query, focusedMoment }) {
    return query + timeframe.windowSize + timeframe.to + focusedMoment;
  },

  getData(subscriptionId, { timeframe, query, focusedMoment }) {
    return {
      subscriptionId,
      focusedMoment,
      timeframe,
      query
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
