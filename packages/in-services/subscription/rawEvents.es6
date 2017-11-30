import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-raw-events',

  getId: ({ time, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) =>
    time + maxTimestamp + minTimestamp + sortByField + sortMode + Math.round(Date.now() / 2000) + query + offset + size,

  getData: (subscriptionId, { time, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset, size }) => {
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

  transformData: events => fromJS(events)
});
