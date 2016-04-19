import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-physical-hierarchy',

  // getID
  ({snapshotId, time}) => snapshotId + time,

  // data to be send for subscription
  (subscriptionId, {snapshotId, time}) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  // data transformation on onData
  data => Immutable.List(data)
);
