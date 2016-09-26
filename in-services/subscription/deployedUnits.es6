import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-deployed-units',

  getId: ({snapshotId, time}) => snapshotId + time,

  getData: (subscriptionId, {snapshotId, time}) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: data => Immutable.Set(data)
});
