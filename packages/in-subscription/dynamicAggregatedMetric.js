/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-dynamic-aggregated-metric',

  getData(subscriptionId, { snapshotId, metric, timeConfig, aggregation, blockSizeMillis, metricBaseMillis }) {
    return {
      subscriptionId,
      snapshotId,
      timeConfig,
      metric,
      aggregation,
      blockSizeMillis,
      metricBaseMillis
    };
  },

  transform(observable, { timeConfig }) {
    // In case of resubscribes to the same dynamicAggregation observable, ensure that subscribers
    // also get the initial value. The initial value would contain the historic values. This is
    // only problematic with timeConfig.to == null, i.e. live mode. Because in live mode, live updates
    // would overwrite the historic value in the obserable (behavior subject).

    return observable.scan((allDataPoints, newDataPoints) => {
      const newDataPointTimestamps = {};
      for (let i = 0, len = newDataPoints.length; i < len; i++) {
        const time = newDataPoints[i][0];
        newDataPoints[i].time = time;
        newDataPointTimestamps[time] = true;
      }

      allDataPoints = allDataPoints || [];
      const lastValidTimestamp = (timeConfig.to == null ? Date.now() : timeConfig.to) - timeConfig.windowSize;

      const result = allDataPoints
        .filter(
          dataPoints =>
            // remove data points that are too old
            dataPoints.time >= lastValidTimestamp &&
            // remove all old data points for which we retrieved updated values
            newDataPointTimestamps[dataPoints.time] !== true
        )
        .concat(newDataPoints);

      return result;
    }, null);
  },

  memoizeFor: 100
});
