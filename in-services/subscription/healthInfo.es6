import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-health-info',

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
  healthInfo => Immutable.fromJS(healthInfo)
);
