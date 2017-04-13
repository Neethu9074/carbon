import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-logs',

  getId({ time, maxTimestamp, minTimestamp, query, offset }) {
    return time + maxTimestamp + minTimestamp + Math.round(Date.now() / 2000) + query + offset;
  },

  getData(subscriptionId, { time, maxTimestamp, minTimestamp, query, offset }) {
    return {
      subscriptionId,
      time,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp,
      query,
      offset
    };
  }
});
