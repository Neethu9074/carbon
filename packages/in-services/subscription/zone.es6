import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-zone',

  getId: ({ snapshotId, time }) => snapshotId + time,

  getData: (subscriptionId, { snapshotId, time }) => {
    return {
      subscriptionId,
      snapshotId,
      time
    };
  },

  transformData: zoneId => zoneId
});
