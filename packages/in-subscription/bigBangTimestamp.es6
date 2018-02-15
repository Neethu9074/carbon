import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-big-bang-timestamp',

  getId() {
    return 'big-bang-timestamp';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  }
});
