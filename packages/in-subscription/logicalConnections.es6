import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-logical-connections',

  getId({ time, snapshotId }) {
    return snapshotId + time;
  },

  getData(subscriptionId, { time, snapshotId }) {
    return {
      subscriptionId,
      time,
      snapshotId
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
