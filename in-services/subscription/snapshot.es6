import {fromJS} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';
import {roundToNearestTimeBlock} from 'in-services/subscription/util';


export default createSubscription({
  eventId: 'subscribe-snapshot',

  getId({snapshotId, time}) {
    return snapshotId + roundToNearestTimeBlock(time);
  },

  getData(subscriptionId, {snapshotId, time}) {
    return {
      subscriptionId,
      snapshotId,
      time: roundToNearestTimeBlock(time)
    };
  },

  transformData(data) {
    return fromJS(data);
  }
});
