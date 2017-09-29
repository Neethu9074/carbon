import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshots-in-timeframe',

  getId: ({ timeframe, query, focusedMoment }) => query + timeframe.windowSize + timeframe.to + focusedMoment,

  getData: (subscriptionId, { timeframe, query, focusedMoment }) => {
    return {
      subscriptionId,
      focusedMoment,
      timeframe,
      query
    };
  },

  transformData: data => fromJS(data)
});
