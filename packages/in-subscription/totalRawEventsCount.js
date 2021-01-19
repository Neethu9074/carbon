/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-raw-events-count',
  disposeSubscriptionOnDocumentHidden: false,

  getId({ timeConfig }) {
    return timeConfig.to + ',' + timeConfig.windowSize;
  },

  getData(subscriptionId, { timeConfig }) {
    return {
      subscriptionId,
      timeConfig
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  },

  memoizeFor: 100
});
