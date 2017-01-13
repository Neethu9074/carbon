import {fromJS} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-eum-statistics',

  getId({snapshotId, timeframe}) {
    return `${snapshotId}${timeframe.to}${timeframe.windowSize}`;
  },

  getData(subscriptionId, {snapshotId, timeframe}) {
    return {
      subscriptionId,
      snapshotId,
      timeframe
    };
  },

  transformData(data) {
    return fromJS(data);
  }
});
