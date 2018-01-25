import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-is-monitoring',

  getId() {
    return 'isMonitoring';
  },

  getData(subscriptionId) {
    return {
      subscriptionId
    };
  }
});
