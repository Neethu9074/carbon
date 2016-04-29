import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-traces',

  // getID
  getId,
  // data to be send for subscription
  (subscriptionId, {maxTimestamp, minTimestamp, sortByField, sortMode}) => {
    return {
      subscriptionId,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp: minTimestamp,
      sortByField: sortByField,
      sortMode: sortMode
    };
  },

  // data transformation on onData
  traceData => Immutable.fromJS(traceData)
);

function getId({maxTimestamp, minTimestamp, sortByField, sortMode}) {
  return 'traces'
        + maxTimestamp
        + minTimestamp
        + sortByField
        + sortMode
        + Math.round(Date.now() / 1000);
}
