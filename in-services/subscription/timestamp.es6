import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'timestamp',

  // getID
  ({originate}) => originate,

  // data to be send for subscription
  (subscriptionId, {originate}) => {
    return {
      subscriptionId,
      originate
    };
  },

  // data transformation on onData
  reply => reply
);
