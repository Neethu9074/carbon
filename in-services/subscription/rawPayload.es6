import {fromJS} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-raw-payload',

  getId: ({snapshotId, payloadName}) => snapshotId + payloadName,

  getData: (subscriptionId, {snapshotId, payloadName}) => {
    return {
      subscriptionId,
      snapshotId,
      payloadName
    };
  },

  transformData: rawPayload => fromJS(rawPayload)
});
