import createHistoricMetricObservable from 'in-services/subscription/historicMetric';
import createLiveMetricObservable from 'in-services/subscription/liveMetric';
import {timeframe$} from 'in-stores/timeline';

const MAX_NUMBER_OF_METRICS_FOR_CHARTS = 800;

// There is currently no other form of aggregation, but we already want
// to have this communication style with the backend.
const defaultAggregation = 'mean';

export function getLiveMetrics({snapshotId, metric, timeframe = null, rollup}) {
  if (rollup === undefined) {
    rollup = getDefaultMetricRollupDuration(timeframe);
  }

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


function getHistoricMetrics({snapshotId, metric, timeframe, rollup}) {
  if (rollup === undefined) {
    rollup = getDefaultMetricRollupDuration(timeframe);
  }


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
  {
    availableFor: 1000 * 60 * 10 + 3000, // 10m + 3s (to give it some slack when deactivating live mode)
    rollup: null, // 1s
    label: '1s'
  },
  {
    availableFor: 1000 * 60 * 60 * 24, // 1d
    rollup: 1000 * 5, // 5s
    label: '5s'
  },
  {
    availableFor: 1000 * 60 * 60 * 24 * 31, // 1 month
    rollup: 1000 * 60, // 1m
    label: '1min'
  },
  {
    availableFor: 1000 * 60 * 60 * 24 * 31 * 3, // 3 months
    rollup: 1000 * 60 * 5, // 5m
    label: '5min'
  },
  {
    availableFor: Number.MAX_VALUE, // forever
    rollup: 1000 * 60 * 60, // 1h
    label: '1h'
  }
];

export function getDefaultMetricRollupDuration(timeframe) {
  if (!timeframe) {
    return null;
  }

  // Ignoring time differences for now since small time differences
  // can be accepted. This time is only used to calculate the rollup.
  const now = Date.now();
  const to = timeframe.to ? timeframe.to : now;
  const from = to - timeframe.windowSize;

  const availableRollupDefinitions = rollupDurationThresholds.filter(rollupDefinition =>
    from >= now - rollupDefinition.availableFor
  );

  for (let i = 0, len = availableRollupDefinitions.length; i < len; i++) {
    // this works because the rollupDurationThresholds array is sorted by rollup
    // the first rollup matching the requirements is returned
    const rollupDefinition = availableRollupDefinitions[i];
    const rollup = rollupDefinition.rollup || 1000;
    if (timeframe.windowSize / rollup <= MAX_NUMBER_OF_METRICS_FOR_CHARTS) {
      return rollupDefinition.rollup;
    }
  }

  return rollupDurationThresholds[rollupDurationThresholds.length - 1].rollup;
}

export const currentRollup$ = timeframe$
  .map(getDefaultMetricRollupDuration)
  .map(rollup => {
    for (let i = 0, len = rollupDurationThresholds.length; i < len; i++) {
      if (rollupDurationThresholds[i].rollup === rollup) {
        return rollupDurationThresholds[i].label;
      }
    }

    return 'Unknown rollup';
  });
