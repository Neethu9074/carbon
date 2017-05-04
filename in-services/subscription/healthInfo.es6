import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-health-info',

  getId: ({ snapshotId, focusedMoment }) => snapshotId + focusedMoment,

  getData: (subscriptionId, { snapshotId, focusedMoment }) => {
    return {
      subscriptionId,
      snapshotId,
      time: focusedMoment
    };
  },

  transformData: healthInfo => fromJS(healthInfo)
});
