import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-dynamic-aggregated-metric',

  getId: ({ snapshotId, metric, timeframe, aggregation, blockSizeMillis }) =>
    snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + blockSizeMillis,

  getData: (subscriptionId, { snapshotId, metric, timeframe, aggregation, blockSizeMillis, metricBaseMillis }) => {
    return {
      subscriptionId,
      snapshotId,
      timeframe,
      metric,
      aggregation,
      blockSizeMillis,
      metricBaseMillis
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
