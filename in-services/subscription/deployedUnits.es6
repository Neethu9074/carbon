import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-deployed-units',

  // getID
  snapshotId => snapshotId,

  // data to be send for subscription
  (subscriptionId, snapshotId) => {
    return {
      subscriptionId,
      snapshotId
    };
  },

  // data transformation on onData
  data => Immutable.Set(data)
);
