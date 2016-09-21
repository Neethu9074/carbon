import createSubscription from 'in-services/subscription/subscription';

export default createSubscription(
  // event ID
  'subscribe-shed-events-count',

  // getID
  ({timeframe, query}) => timeframe.to + timeframe.windowSize + query,

  // data to be send for subscription
  (subscriptionId, {timeframe, query}) => {
    return {
      subscriptionId,
      timeframe,
      query
    };
  },

  // data transformation on onData
  count => count
);
