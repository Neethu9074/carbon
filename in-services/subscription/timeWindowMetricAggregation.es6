import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-time-window-metric-aggregation',

  getId({ snapshotId, metric, timeframe, aggregation, rollup, timeWindowAggregation }) {
    return snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + rollup + timeWindowAggregation;
  },

  getData(subscriptionId, { snapshotId, metric, timeframe, aggregation, rollup, timeWindowAggregation }) {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      timeframe,
      metric,
      rollup,
      timeWindowAggregation
    };
  },

  memoizeFor: 1000
});
