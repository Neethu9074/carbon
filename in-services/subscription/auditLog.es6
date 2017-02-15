import {fromJS} from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-audit-log',

  getId,

  getData: (subscriptionId, timeframe) => {
    return {
      subscriptionId,
      timeframe
    };
  },

  transformData: events => fromJS(events)
});

function getId(timeframe) {
  return timeframe.to + ',' + timeframe.windowSize;
}
