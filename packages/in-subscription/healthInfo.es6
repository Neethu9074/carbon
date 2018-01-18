import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-health-info',

  getId({ snapshotId, focusedMoment }) {
    return snapshotId + focusedMoment;
  },

  getData(subscriptionId, { snapshotId, focusedMoment }) {
    return {
      subscriptionId,
      snapshotId,
      time: focusedMoment
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
