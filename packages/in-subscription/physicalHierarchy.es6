import { List } from 'immutable';

import { roundToNearestTimeBlock } from 'in-subscription/util';
import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-physical-hierarchy',

  getId({ snapshotId, timeConfig, includeCluster }) {
    return snapshotId + generateStableHash(roundToNearestTimeBlock(timeConfig)) + includeCluster;
  },

  getData(subscriptionId, { snapshotId, timeConfig, includeCluster }) {
    return {
      subscriptionId,
      snapshotId,
      timeConfig: roundToNearestTimeBlock(timeConfig),
      clusterIncluded: includeCluster
    };
  },

  transform(observable) {
    return observable.map(List);
  }
});
