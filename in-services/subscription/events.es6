import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-events',

  getId: timeframe => timeframe.to + ',' + timeframe.windowSize,

  getData: (subscriptionId, timeframe) => {
    return {
      subscriptionId,
      timeframe
    };
  },

  transformData: events => fromJS(events)
});
