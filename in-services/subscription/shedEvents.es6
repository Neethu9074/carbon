import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-shed-event',

  // getID
  getId,

  // data to be send for subscription
  (subscriptionId, {maxTimestamp, minTimestamp, sortByField, sortMode, query, offset}) => {
    return {
      subscriptionId,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp,
      sortByField,
      sortMode,
      query,
      offset
    };
  },

  // data transformation on onData
  traceData => Immutable.fromJS(traceData)
);

function getId({maxTimestamp, minTimestamp, sortByField, sortMode, query, offset}) {
  return maxTimestamp
        + minTimestamp
        + sortByField
        + sortMode
        + Math.round(Date.now() / 2000)
        + query
        + offset;
}
