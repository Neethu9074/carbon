import { List } from 'immutable';

import createSubscription from 'in-subscription/subscription';
import { roundToNearestTimeBlock } from 'in-subscription/util';

export default createSubscription({
  eventId: 'subscribe-physical-hierarchy',

  getId({ snapshotId, time, includeCluster }) {
    return snapshotId + roundToNearestTimeBlock(time) + includeCluster;
  },

  getData(subscriptionId, { snapshotId, time, includeCluster }) {
    return {
      subscriptionId,
      snapshotId,
      time: roundToNearestTimeBlock(time),
      clusterIncluded: includeCluster
    };
  },

  transform(observable) {
    return observable.map(List);
  }
});
