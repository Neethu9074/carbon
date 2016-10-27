import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-live-metric',

  getId({snapshotId, metric, aggregation, rollup}) {
    return snapshotId +
      metric +
      aggregation +
      rollup;
  },

  getData(subscriptionId, {snapshotId, metric, aggregation, rollup}) {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      metric,
      rollup
    };
  },

  transformData(dataPoint) {
    dataPoint.time = dataPoint[0];
    return dataPoint;
  }
});
