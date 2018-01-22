import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-message',

  getId() {
    return 'messageSubscription';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  }
});
