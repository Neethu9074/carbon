import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-shed-events',

  getId: ({maxTimestamp, minTimestamp, sortByField, sortMode, query, offset}) => maxTimestamp +
                                                                                 minTimestamp +
                                                                                 sortByField +
                                                                                 sortMode +
                                                                                 Math.round(Date.now() / 2000) +
                                                                                 query +
                                                                                 offset,

  getData: (subscriptionId, {maxTimestamp, minTimestamp, sortByField, sortMode, query, offset}) => {
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

  transformData: events => Immutable.fromJS(events)
});
