import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-graph',

  getData(subscriptionId, timeConfig) {
    return {
      subscriptionId,
      timeConfig
    };
  }
});
