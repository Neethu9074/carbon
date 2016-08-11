import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-traces',

  // getID
  getId,
  // data to be send for subscription
  (subscriptionId, {maxTimestamp, minTimestamp, sortByField, sortMode, query}) => {
    return {
      subscriptionId,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp,
      sortByField,
      sortMode,
      query
    };
  },

  // data transformation on onData
  traceData => Immutable.fromJS(traceData)
);

function getId({maxTimestamp, minTimestamp, sortByField, sortMode, query}) {
  return maxTimestamp
        + minTimestamp
        + sortByField
        + sortMode
        + Math.round(Date.now() / 1000)
        + query;
}
