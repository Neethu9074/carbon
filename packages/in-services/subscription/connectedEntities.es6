import { Map } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-connected-entities',

  getId: ({ snapshotId, time }) => snapshotId + time,

  getData: (subscriptionId, { snapshotId, time }) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: data => Map(data)
});
