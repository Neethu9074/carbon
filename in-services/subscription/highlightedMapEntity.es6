import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-highlighted-map-entity',

  getId: ({ snapshotId, time }) => snapshotId + time,

  getData: (subscriptionId, { snapshotId, time }) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: foundations => foundations
});
