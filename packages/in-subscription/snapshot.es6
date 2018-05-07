import { fromJS } from 'immutable';
import invariant from 'invariant';

import { roundToNearestTimeBlock } from 'in-subscription/util';
import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-snapshot',

  getId({ snapshotId, timeConfig }) {
    if (__DEV__) {
      invariant(snapshotId != null, 'No snapshot ID defined for snapshot subscription');
    }
    return snapshotId + generateStableHash(roundToNearestTimeBlock(timeConfig));
  },

  getData(subscriptionId, { snapshotId, timeConfig }) {
    return {
      subscriptionId,
      snapshotId,
      timeConfig: roundToNearestTimeBlock(timeConfig)
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  }
});
