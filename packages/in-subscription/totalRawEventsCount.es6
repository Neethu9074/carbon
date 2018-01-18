import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-raw-events-count',
  disposeSubscriptionOnDocumentHidden: false,

  getId({ timeframe }) {
    return timeframe.to + ',' + timeframe.windowSize;
  },

  getData(subscriptionId, { timeframe }) {
    return {
      subscriptionId,
      timeframe
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
