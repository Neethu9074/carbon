import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-ui-debugging-instructions',

  getId() {
    return '';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  }
});
