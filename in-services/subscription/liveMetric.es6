import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-live-metric',

  getId({ snapshotId, metric, rollup, dynamicRollupMultiplier }) {
    return snapshotId + metric + rollup + dynamicRollupMultiplier;
  },

  getData(subscriptionId, { snapshotId, metric, rollup, dynamicRollupMultiplier }) {
    return {
      subscriptionId,
      snapshotId,
      metric,
      rollup,
      dynamicRollupMultiplier
    };
  },

  transformData(dataPoint) {
    dataPoint.time = dataPoint[0];
    return dataPoint;
  },

  memoizeFor: 1000
});
