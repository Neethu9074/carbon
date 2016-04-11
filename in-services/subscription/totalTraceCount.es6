import createSubscription from 'in-services/subscription/subscription';

export default createSubscription.bind(null,
  // event ID
  'subscribe-trace-count',

  // getID
  () => 'total-trace-count',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  count => count
);
