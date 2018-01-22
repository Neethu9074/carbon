import { Set } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-cluster-members',

  getId({ snapshotId, time }) {
    return snapshotId + time;
  },

  getData(subscriptionId, { snapshotId, time }) {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transform(observable) {
    return observable.map(Set);
  }
});
