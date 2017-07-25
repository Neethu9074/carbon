import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-dynamic-aggregated-metric',

  getId: ({ snapshotId, metric, timeframe, aggregation, blockWindowSize }) =>
    snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + blockWindowSize,

  getData: (subscriptionId, { snapshotId, metric, timeframe, aggregation, blockWindowSize, metricBaseUnit }) => {
    return {
      subscriptionId,
      snapshotId,
      timeframe,
      metric,
      aggregation,
      blockSizeMillis: blockWindowSize,
      metricBaseMillis: metricBaseUnit
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
