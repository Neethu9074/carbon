import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-shed-events-count',

  getId: ({timeframe}) => timeframe.to + ',' + timeframe.windowSize,

  getData: (subscriptionId, {timeframe}) => {
    return {
      subscriptionId,
      timeframe,
      query: ''
    };
  },

  transformData: counter => Immutable.fromJS(counter)
});
