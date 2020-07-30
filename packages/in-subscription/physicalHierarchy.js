import { List } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-physical-hierarchy',

  getData(subscriptionId, { snapshotId, timeConfig, includeCluster, includeKubernetes }) {
    return {
      subscriptionId,
      snapshotId,
      timeConfig,
      clusterIncluded: includeCluster,
      kubernetesIncluded: includeKubernetes
    };
  },

  transform(observable) {
    return observable.map(List);
  }
});
