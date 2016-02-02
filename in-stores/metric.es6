import createLiveMetricObservable from 'in-services/subscription/liveMetric';


export function getLiveMetrics(snapshotId, metric) {
  return createLiveMetricObservable({
    snapshotId,
    metric
  });
}


export function getMetricName(metric, timeframe) {
  const rollup = getDefaultMetricRollupDuration(timeframe);
  if (rollup) {
    return metric + '.mean.' + rollup;
  }
  return metric;
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
    if (timeframe <= config.maxTimeframe) {
      return config.rollup;
    }
  }

  throw new Error('Could not determine rollup for timeframe ' + timeframe);
}
