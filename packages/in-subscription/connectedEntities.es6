import { Map } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-connected-entities',

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
    return observable.map(Map);
  }
});
