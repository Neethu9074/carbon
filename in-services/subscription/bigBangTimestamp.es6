import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-big-bang-timestamp',

  // getID
  () => 'big-bang-timestamp',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  timestamp => timestamp
);
