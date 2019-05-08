import { List } from 'immutable';

import { roundToNearestTimeBlock } from 'in-subscription/util';
import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-physical-hierarchy',

  getId({ snapshotId, timeConfig, includeCluster, includeKubernetes }) {
    return snapshotId + generateStableHash(roundToNearestTimeBlock(timeConfig)) + includeCluster + includeKubernetes;
  },

  getData(subscriptionId, { snapshotId, timeConfig, includeCluster, includeKubernetes }) {
    return {
      subscriptionId,
      snapshotId,
      timeConfig: roundToNearestTimeBlock(timeConfig),
      clusterIncluded: includeCluster,
      kubernetesIncluded: includeKubernetes
    };
  },

  transform(observable) {
    return observable.map(List);
  }
});
