import createSubscription from 'in-services/subscription/subscription';

export default createSubscription(
  // event ID
  'subscribe-graph-universe',

  // getID
  time => time,

  // data to be send for subscription
  (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  // data transformation on onData
  e => e
);
