import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-raw-payload',

  getId({ snapshotId, time, payloadName }) {
    return snapshotId + payloadName + time;
  },

  getData(subscriptionId, { snapshotId, payloadName, time }) {
    return {
      subscriptionId,
      snapshotId,
      payloadName,
      time
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
