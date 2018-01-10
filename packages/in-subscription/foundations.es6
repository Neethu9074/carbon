import { Set } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-foundations',

  getId: ({ snapshotId, time }) => snapshotId + time,

  getData: (subscriptionId, { snapshotId, time }) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: foundations => Set(foundations)
});
