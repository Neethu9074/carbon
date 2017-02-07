import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-logs',

  getId({maxTimestamp, minTimestamp, query, offset}) {
    return maxTimestamp +
      minTimestamp +
      Math.round(Date.now() / 2000) +
      query +
      offset;
   },

  getData(subscriptionId, {maxTimestamp, minTimestamp, query, offset}) {
    return {
      subscriptionId,
      maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
      minTimestamp,
      query,
      offset
    };
  }
});
