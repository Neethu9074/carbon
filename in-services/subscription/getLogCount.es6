import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-log-count',

  getId({timeframe, query}) {
    return query + timeframe.to + timeframe.windowSize;
  },

  getData(subscriptionId, {timeframe, query}) {
    return {
      subscriptionId,
      timeframe,
      query
    };
  }
});
