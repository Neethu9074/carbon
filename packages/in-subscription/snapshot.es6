import { fromJS } from 'immutable';
import invariant from 'invariant';

import createSubscription from 'in-subscription/subscription';
import { roundToNearestTimeBlock } from 'in-subscription/util';

export default createSubscription({
  eventId: 'subscribe-snapshot',

  getId({ snapshotId, time }) {
    if (__DEV__) {
      invariant(snapshotId != null, 'No snapshot ID defined for snapshot subscription');
    }
    return snapshotId + roundToNearestTimeBlock(time);
  },

  getData(subscriptionId, { snapshotId, time }) {
    return {
      subscriptionId,
      snapshotId,
      time: roundToNearestTimeBlock(time)
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
