import { List } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';
import { roundToNearestTimeBlock } from 'in-services/subscription/util';

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

  transformData(data) {
    return List(data);
  }
});
