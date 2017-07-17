import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-live-metric',

  getId({ snapshotId, metric, aggregation, rollup, dynamicRollupMultiplier }) {
    return snapshotId + metric + aggregation + rollup + dynamicRollupMultiplier;
  },

  getData(subscriptionId, { snapshotId, metric, aggregation, rollup, dynamicRollupMultiplier }) {
    return {
      subscriptionId,
      aggregation,
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
