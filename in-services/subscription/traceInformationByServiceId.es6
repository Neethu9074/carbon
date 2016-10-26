import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-traces-by-service-id',

  getId: ({timeframe, snapshotId}) => timeframe.to + timeframe.windowSize + snapshotId,

  getData: (subscriptionId, {timeframe, snapshotId}) => {
    return {
      subscriptionId,
      timeframe,
      snapshotId
    };
  },

  transformData: traceInformation => Immutable.fromJS(traceInformation)
});
