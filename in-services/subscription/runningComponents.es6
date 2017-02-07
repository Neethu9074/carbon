import {Set} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-running-components',

  getId: ({snapshotId, time}) => snapshotId + time,

  getData: (subscriptionId, {snapshotId, time}) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: components => Set(components)
});
