import createSubscription from 'in-services/subscription/subscription';

export default createSubscription.bind(null,
  // event ID
  'subscribe-trace-count',

  // getID
  timeframe => 'total-trace-count' + timeframe.to + timeframe.windowSize,

  // data to be send for subscription
  (subscriptionId, timeframe) => {
    return {
      subscriptionId,
      timeframe
    };
  },

  // data transformation on onData
  count => count
);
