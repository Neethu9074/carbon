import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric',

  getId: ({ snapshotId, metric, timeframe, rollup }) =>
    snapshotId + metric + timeframe.windowSize + timeframe.to + rollup,

  getData: (subscriptionId, { snapshotId, metric, timeframe, rollup }) => {
    return {
      subscriptionId,
      snapshotId,
      timeframe,
      metric,
      rollup
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
