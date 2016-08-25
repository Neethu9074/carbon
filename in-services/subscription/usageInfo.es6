import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription(
  // event ID
  'subscribe-usage-info',

  // getID
  () => '',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  usageInfo => usageInfo ? Immutable.Map({
    type: usageInfo.type.toLowerCase(),
    note: usageInfo.note
  }) : null
);
