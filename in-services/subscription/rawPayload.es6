import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-raw-payload',

  getId: ({ snapshotId, time, payloadName }) => snapshotId + payloadName + time,

  getData: (subscriptionId, { snapshotId, payloadName, time }) => {
    return {
      subscriptionId,
      snapshotId,
      payloadName,
      time
    };
  },

  transformData: rawPayload => fromJS(rawPayload)
});
