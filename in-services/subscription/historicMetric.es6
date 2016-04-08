import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-historic-metric',

  getId,

  // data to be send for subscription
  (subscriptionId, {snapshotId, metric, timeframe, aggregation, rollup}) => {
    return {
      subscriptionId,
      aggregation,
      snapshotId,
      timeframe,
      metric,
      rollup
    };
  },

  // data transformation on onData
  update => update
);

function getId({snapshotId, metric, timeframe, aggregation, rollup}) {
  return snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + rollup;
}
