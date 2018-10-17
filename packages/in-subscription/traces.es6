import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';
import { generateStableHash } from 'in-services/util/id';

export default createSubscription({
  eventId: 'subscribe-traces',

  getId({ timeConfig, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) {
    return (
      generateStableHash(timeConfig) +
      maxTimestamp +
      minTimestamp +
      sortByField +
      sortMode +
      Math.round(Date.now() / 5000) +
      query +
      offset +
      size
    );
  },

  getData(subscriptionId, { timeConfig, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) {
    return {
      subscriptionId,
      timeConfig,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp,
      sortByField,
      sortMode,
      query,
      offset,
      size
    };
  },

  transform(observable) {
    return observable.map(fromJS);
  },
  disableMemoize: true
});
