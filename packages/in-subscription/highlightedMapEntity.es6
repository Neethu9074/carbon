import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-highlighted-map-entity',

  getId({ snapshotId, time }) {
    return snapshotId + time;
  },

  getData(subscriptionId, { snapshotId, time }) {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  }
});
