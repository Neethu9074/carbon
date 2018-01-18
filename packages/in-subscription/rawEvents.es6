import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-raw-events',

  getId({ time, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) {
    return (
      time +
      maxTimestamp +
      minTimestamp +
      sortByField +
      sortMode +
      Math.round(Date.now() / 2000) +
      query +
      offset +
      size
    );
  },

  getData(subscriptionId, { time, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) {
    return {
      subscriptionId,
      time,
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
  }
});
