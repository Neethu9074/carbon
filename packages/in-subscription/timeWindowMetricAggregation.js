/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-time-window-metric-aggregation',

  getId({ snapshotId, metric, timeConfig, aggregation, rollup, timeWindowAggregation }) {
    return snapshotId + metric + timeConfig.windowSize + timeConfig.to + aggregation + rollup + timeWindowAggregation;
  },

  getData(subscriptionId, { snapshotId, metric, timeConfig, aggregation, rollup, timeWindowAggregation }) {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      timeConfig,
      metric,
      rollup,
      timeWindowAggregation
    };
  },

  memoizeFor: 1000
});
