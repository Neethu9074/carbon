import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-traces',

  getId: ({ time, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset }) =>
    time + maxTimestamp + minTimestamp + sortByField + sortMode + Math.round(Date.now() / 2000) + query + offset,

  getData: (subscriptionId, { time, maxTimestamp, minTimestamp, sortByField, sortMode, query, offset }) => {
    return {
      subscriptionId,
      time,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp,
      sortByField,
      sortMode,
      query,
      offset
    };
  },

  transformData: traceData => fromJS(traceData)
});
