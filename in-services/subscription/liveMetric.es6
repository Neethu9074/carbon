import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-live-metric',

  getId,

  // data to be send for subscription
  (subscriptionId, {snapshotId, metric, aggregation, rollup}) => {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      metric,
      rollup
    };
  },

  // data transformation on onData
  dataPoint => {
    dataPoint.time = dataPoint[0];
    return dataPoint;
  }
);

function getId({snapshotId, metric, aggregation, rollup}) {
  return snapshotId + metric + aggregation + rollup;
}
