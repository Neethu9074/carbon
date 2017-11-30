import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-physical-context',

  getId({ snapshotId, time }) {
    return snapshotId + time;
  },

  getData(subscriptionId, { snapshotId, time }) {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData(context) {
    return fromJS(context);
  }
});
