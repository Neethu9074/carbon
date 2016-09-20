import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-historic-metric-single',

  getId,

  // data to be send for subscription
  (subscriptionId, {snapshotId, metric, time, aggregation, rollup}) => {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      time,
      metric,
      rollup
    };
  },

  // data transformation on onData
  v => v,

  100
);

function getId({snapshotId, metric, time, aggregation, rollup}) {
  return snapshotId + metric + time + aggregation + rollup;
}
