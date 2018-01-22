import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-graph',

  getId(time) {
    return time;
  },

  getData(subscriptionId, time) {
    return {
      subscriptionId,
      time
    };
  }
});
