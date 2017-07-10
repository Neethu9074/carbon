import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric',

  getId: ({ snapshotId, metric, timeframe, aggregation, rollup, dynamicRollup }) =>
    snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + dynamicRollup + rollup,

  getData: (subscriptionId, { snapshotId, metric, timeframe, aggregation, rollup, dynamicRollup }) => {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      timeframe,
      metric,
      rollup,
      dynamicRollup
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
