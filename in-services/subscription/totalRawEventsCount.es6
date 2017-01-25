import {fromJS} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-raw-events-count',
  disposeSubscriptionOnDocumentHidden: false,

  getId({timeframe}) {
    return  timeframe.to + ',' + timeframe.windowSize;
  },

  getData(subscriptionId, {timeframe}) {
    return {
      subscriptionId,
      timeframe
    };
  },

  transformData(counter) {
    return fromJS(counter);
  }
});
