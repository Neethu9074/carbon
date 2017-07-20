import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-live-metric',

  getId({ snapshotId, metric, rollup, dynamicRollupMultiplier, dynamicRollupAggregation }) {
    return snapshotId + metric + rollup + dynamicRollupAggregation + dynamicRollupMultiplier;
  },

  getData(subscriptionId, { snapshotId, metric, rollup, dynamicRollupMultiplier, dynamicRollupAggregation }) {
    return {
      subscriptionId,
      snapshotId,
      metric,
      rollup,
      dynamicRollupMultiplier,
      dynamicRollupAggregation
    };
  },

  transformData(dataPoint) {
    dataPoint.time = dataPoint[0];
    return dataPoint;
  },

  memoizeFor: 1000
});
