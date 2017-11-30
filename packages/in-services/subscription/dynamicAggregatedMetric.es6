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

  // In case of resubscribes to the same dynamicAggregation observable, ensure that subscribers
  // also get the initial value. The initial value would contain the historic values. This is
  // only problematic with timeframe.to == null, i.e. live mode. Because in live mode, live updates
  // would overwrite the historic value in the obserable (behavior subject).
  getScanner({ timeframe }) {
    return (allDataPoints, newDataPoints) => {
      const newDataPointTimestamps = {};
      for (let i = 0, len = newDataPoints.length; i < len; i++) {
        const time = newDataPoints[i][0];
        newDataPoints[i].time = time;
        newDataPointTimestamps[time] = true;
      }

      allDataPoints = allDataPoints || [];
      const lastValidTimestamp = (timeframe.to == null ? Date.now() : timeframe.to) - timeframe.windowSize;

      const result = allDataPoints
        .filter(
          dataPoints =>
            // remove data points which are too old
            dataPoints.time >= lastValidTimestamp &&
            // remove all old data points for which we retrieved updated values
            newDataPointTimestamps[dataPoints.time] !== true
        )
        .concat(newDataPoints);

      return result;
    };
  },

  memoizeFor: 100
});
