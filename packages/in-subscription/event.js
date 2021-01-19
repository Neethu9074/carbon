/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromJS } from 'immutable';
import invariant from 'invariant';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-event',

  getId({ eventId }) {
    return eventId;
  },

  getData(subscriptionId, { eventId }) {
    if (__DEV__) {
      invariant(eventId != null, 'No event ID defined for event subscription');
    }
    return {
      subscriptionId,
      eventId
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
