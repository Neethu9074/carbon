import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-service-instances',

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
  components => Immutable.Set(components)
);
