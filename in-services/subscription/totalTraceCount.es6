import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace-count',

  getId: ({timeframe, query}) => timeframe.to + timeframe.windowSize + query,

  getData: (subscriptionId, {timeframe, query}) => {
    return {
      subscriptionId,
      timeframe,
      query
    };
  },

  transformData: count => count
});
