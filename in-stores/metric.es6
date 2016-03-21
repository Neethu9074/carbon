import createHistoricMetricObservable from 'in-services/subscription/historicMetric';
import createLiveMetricObservable from 'in-services/subscription/liveMetric';

// There is currently no other form of aggregation, but we already want
// to have this communication style with the backend.
const defaultAggregation = 'mean';

export function getLiveMetrics({snapshotId, metric, timeframe = null}) {
  const rollup = getDefaultMetricRollupDuration(timeframe);
  let aggregation = null;
  if (rollup) {
    aggregation = defaultAggregation;
  }
  return createLiveMetricObservable({
    snapshotId,
    metric,
    aggregation,
    rollup
  });
}


function getHistoricMetrics({snapshotId, metric, timeframe}) {
  const rollup = getDefaultMetricRollupDuration(timeframe);
  let aggregation = null;
  if (rollup) {
    aggregation = defaultAggregation;
  }
  return createHistoricMetricObservable({
    snapshotId,
    metric,
    timeframe,
    aggregation,
    rollup
  });
}


export function getHistoricMetricsWithLiveUpdates(opts) {
  const live$ = getLiveMetrics(opts)
    // bring the two streams into the same format
    .map(update => [update]);
  const historic$ = getHistoricMetrics(opts);
  return live$.merge(historic$);
}

export function getMetricsForTimeframe(opts) {
  return opts.timeframe.to ?
    getHistoricMetrics(opts) :
    getHistoricMetricsWithLiveUpdates(opts);
}


const rollupDurationThresholds = [
  { // 10 minutes
    maxTimeframe: 1000 * 60 * 10,
    rollup: null
  },
  { // 1 hour
    maxTimeframe: 1000 * 60 * 60,
    rollup: 1000 * 5
  },
  { // 12 hours
    maxTimeframe: 1000 * 60 * 60 * 12,
    rollup: 1000 * 60
  },
  { // 24 hours
    maxTimeframe: 1000 * 60 * 24,
    rollup: 1000 * 60 * 2
  },
  { // indefinite for everything else
    maxTimeframe: Number.MAX_VALUE,
    rollup: 1000 * 60 * 5
  }
];

export function getDefaultMetricRollupDuration(timeframe) {
  if (!timeframe) {
    return null;
  }

  for (let i = 0, len = rollupDurationThresholds.length; i < len; i++) {
    const config = rollupDurationThresholds[i];
    if (timeframe.windowSize <= config.maxTimeframe) {
      return config.rollup;
    }
  }

  throw new Error('Could not determine rollup for timeframe ' + timeframe);
}
