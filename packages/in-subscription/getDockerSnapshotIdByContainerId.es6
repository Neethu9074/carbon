import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshot-id-for-kubernetes-container-id',

  getId({ containerId, timeframe }) {
    return containerId + timeframe.windowSize + timeframe.to;
  },

  getData(subscriptionId, { containerId, timeframe }) {
    return {
      subscriptionId,
      containerId,
      timeframe
    };
  }
});
