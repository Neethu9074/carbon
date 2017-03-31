import { fromJS } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-traces',

  getId: ({ maxTimestamp, minTimestamp, sortByField, sortMode, query, offset }) =>
    maxTimestamp + minTimestamp + sortByField + sortMode + Math.round(Date.now() / 2000) + query + offset,

  getData: (subscriptionId, { maxTimestamp, minTimestamp, sortByField, sortMode, query, offset }) => {
    return {
      subscriptionId,
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
