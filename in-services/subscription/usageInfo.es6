import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-usage-info',

  getId: () => '',

  getData: (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  transformData: usageInfo => usageInfo ? Immutable.Map({
    type: usageInfo.type.toLowerCase(),
    note: usageInfo.note
  }) : null
});
