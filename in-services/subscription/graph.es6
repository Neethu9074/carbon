import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-graph',

  getId: time => time,

  // data to be send for subscription
  getData: (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  // data transformation on onData
  transformData: e => e
});
