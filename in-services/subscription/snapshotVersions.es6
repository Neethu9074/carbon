import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-snapshot-versions',

  getId({snapshotId, time}) {
    return snapshotId + time;
  },

  getData(subscriptionId, {snapshotId, time}) {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData(versions) {
    return Immutable.fromJS(versions);
  }
});
