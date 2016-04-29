import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-message',

  // getID
  () => 'messageSubscription',

  // data to be send for subscription
  subscriptionId => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  message => message
);
