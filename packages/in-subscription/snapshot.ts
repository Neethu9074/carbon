/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshot',

  getData(subscriptionId, { snapshotId, timeConfig }) {
    return {
      subscriptionId,
      snapshotId,
      timeConfig
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
