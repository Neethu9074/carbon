import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-service-instance-implementation',

  getId: ({time, serviceInstanceSnapshotId}) => time + serviceInstanceSnapshotId,

  getData: (subscriptionId, {time, serviceInstanceSnapshotId}) => {
    return {
      subscriptionId,
      time,
      serviceInstanceSnapshotId
    };
  }
});
