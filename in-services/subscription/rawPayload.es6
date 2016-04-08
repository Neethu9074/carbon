import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-raw-payload',

  // getID
  ({snapshotId, payloadName}) => snapshotId + payloadName,

  // data to be send for subscription
  (subscriptionId, {snapshotId, payloadName}) => {
    return {
      subscriptionId,
      snapshotId,
      payloadName
    };
  },

  // data transformation on onData
  rawPayload => Immutable.fromJS(rawPayload)
);
