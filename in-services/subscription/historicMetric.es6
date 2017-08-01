import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric-single',

  getId: ({ snapshotId, metric, time, rollup }) => snapshotId + metric + time + rollup,

  getData: (subscriptionId, { snapshotId, metric, time, rollup }) => {
    return {
      subscriptionId,
      snapshotId,
      time,
      metric,
      rollup
    };
  },

  transformData: v => v,

  memoizeFor: 100
});
