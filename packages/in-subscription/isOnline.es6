import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-is-entity-online',

  getId({ snapshotId }) {
    return snapshotId;
  },

  getData(subscriptionId, { snapshotId }) {
    return {
      subscriptionId,
      snapshotId
    };
  }
});
