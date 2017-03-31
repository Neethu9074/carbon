import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric-single',

  getId: ({ snapshotId, metric, time, aggregation, rollup }) => snapshotId + metric + time + aggregation + rollup,

  getData: (subscriptionId, { snapshotId, metric, time, aggregation, rollup }) => {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      time,
      metric,
      rollup
    };
  },

  transformData: v => v,

  memoizeFor: 100
});
