import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-running-components',

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
  components => Immutable.Set(components)
);
