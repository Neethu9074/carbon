import { Map } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-usage-info',

  getId() {
    return '';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  },

  transform(observable) {
    return observable.map(usageInfo => {
      return usageInfo
        ? Map({
            type: usageInfo.type.toLowerCase(),
            note: usageInfo.note
          })
        : null;
    });
  }
});
