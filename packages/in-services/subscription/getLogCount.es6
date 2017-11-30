import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-log-count',

  getId({ timeframe, focusedMoment, query }) {
    return query + timeframe.to + timeframe.windowSize + focusedMoment;
  },

  getData(subscriptionId, { timeframe, focusedMoment, query }) {
    return {
      subscriptionId,
      time: focusedMoment,
      timeframe,
      query
    };
  }
});
