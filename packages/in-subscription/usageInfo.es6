import { Map } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-usage-info',

  getId: () => '',

  getData: subscriptionId => {
    return {
      subscriptionId
    };
  },

  transformData: usageInfo =>
    usageInfo
      ? Map({
          type: usageInfo.type.toLowerCase(),
          note: usageInfo.note
        })
      : null
});
