import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric',

  getId: ({ snapshotId, metric, timeframe, rollup, dynamicRollupMultiplier }) =>
    snapshotId + metric + timeframe.windowSize + timeframe.to + rollup + dynamicRollupMultiplier,

  getData: (subscriptionId, { snapshotId, metric, timeframe, rollup, dynamicRollupMultiplier }) => {
    return {
      subscriptionId,
      snapshotId,
      timeframe,
      metric,
      rollup,
      dynamicRollupMultiplier
    };
  },

  // data transformation on onData
  transformData: dataPoints => {
    for (let i = 0, len = dataPoints.length; i < len; i++) {
      dataPoints[i].time = dataPoints[i][0];
    }
    return dataPoints;
  },

  memoizeFor: 100
});
