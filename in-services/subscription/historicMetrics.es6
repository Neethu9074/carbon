import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
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
  dataPoints => {
    for (let i = 0, len = dataPoints.length; i < len; i++) {
      dataPoints[i].time = dataPoints[i][0];
    }
    return dataPoints;
  },

  100
);

function getId({snapshotId, metric, timeframe, aggregation, rollup}) {
  return snapshotId + metric + timeframe.windowSize + timeframe.to + aggregation + rollup;
}
