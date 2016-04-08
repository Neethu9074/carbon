import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-is-monitoring',

  // getID
  () => 'isMonitoring',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  monitoring => monitoring
);
