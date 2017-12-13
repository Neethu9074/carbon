import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-pod-for-container',

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
