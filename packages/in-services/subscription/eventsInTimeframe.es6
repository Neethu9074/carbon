import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-events-in-timeframe',

  getId: ({ timeframe, query, focusedMoment }) => query + timeframe.windowSize + timeframe.to + focusedMoment,

  getData: (subscriptionId, { timeframe, query, focusedMoment }) => {
    return {
      subscriptionId,
      focusedMoment,
      timeframe,
      query
    };
  },

  transformData: data => data
});
