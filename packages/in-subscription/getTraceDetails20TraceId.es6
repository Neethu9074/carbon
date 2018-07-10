import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace-details-20-trace-id',

  getData(subscriptionId, traceId) {
    return {
      subscriptionId,
      traceId
    };
  }
});
