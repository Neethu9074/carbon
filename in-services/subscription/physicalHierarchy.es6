import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-physical-hierarchy',

  getId: ({snapshotId, time}) => snapshotId + time,

  getData: (subscriptionId, {snapshotId, time}) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: data => Immutable.List(data)
});
