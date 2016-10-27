import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-traces-by-service-id',

  getId: ({from, to, snapshotId}) => from + to + snapshotId,

  getData: (subscriptionId, {from, to, snapshotId}) => {
    return {
      subscriptionId,
      snapshotId,
      from,
      to
    };
  },

  transformData: traceInformation => Immutable.fromJS(traceInformation)
});
