import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-graph-universe',

  getId: time => time,

  getData: (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  transformData: e => e
});
