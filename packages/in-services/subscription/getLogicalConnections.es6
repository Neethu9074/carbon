import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-logical-connections',

  getId({ time, snapshotId }) {
    return snapshotId + time;
  },

  getData(subscriptionId, { time, snapshotId }) {
    return {
      subscriptionId,
      time,
      snapshotId
    };
  }
});
