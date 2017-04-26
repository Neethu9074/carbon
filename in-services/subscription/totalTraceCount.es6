import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace-count',

  getId: ({ timeframe, focusedMoment, query }) => timeframe.to + timeframe.windowSize + focusedMoment + query,

  getData: (subscriptionId, { timeframe, focusedMoment, query }) => {
    return {
      subscriptionId,
      focusedMoment,
      timeframe,
      query
    };
  },

  transformData: count => count
});
