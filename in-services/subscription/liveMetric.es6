import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-live-metric',

  getId({ snapshotId, metric, rollup }) {
    return snapshotId + metric + rollup;
  },

  getData(subscriptionId, { snapshotId, metric, rollup }) {
    return {
      subscriptionId,
      snapshotId,
      metric,
      rollup
    };
  },

  transformData(dataPoint) {
    dataPoint.time = dataPoint[0];
    return dataPoint;
  },

  memoizeFor: 1000
});
