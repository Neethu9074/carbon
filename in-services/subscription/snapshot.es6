import { fromJS } from 'immutable';
import invariant from 'invariant';

import createSubscription from 'in-services/subscription/subscription';
import { roundToNearestTimeBlock } from 'in-services/subscription/util';

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

  transformData(data) {
    return fromJS(data);
  }
});
