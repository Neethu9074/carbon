import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-cluster-for-pod',

  getId({ snapshotId, time }) {
    return snapshotId + time;
  },

  getData: (subscriptionId, { snapshotId, time }) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  }
});
