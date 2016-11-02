import createHistoricMetricsObservable from 'in-services/subscription/historicMetrics';
import createHistoricMetricObservable from 'in-services/subscription/historicMetric';
import createLiveMetricObservable from 'in-services/subscription/liveMetric';
import memoize from 'in-services/util/memoizingObservableGenerator';
import {timeframe$, focusedMoment$} from 'in-stores/timeline';
import {getAggregation} from 'in-sdk/metrics';
import {createStore} from 'in-stores/store';


const MAX_NUMBER_OF_METRICS_FOR_CHARTS = 800;

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


export function getLiveMetrics({snapshotId, metric, timeframe = null, rollup}) {
  if (rollup === undefined) {
    rollup = getDefaultMetricRollupDuration(timeframe);
  }

  let aggregation = null;
  if (rollup) {
    aggregation = getAggregation(metric);
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
    aggregation = getAggregation(metric);
  }

  return createHistoricMetricsObservable({
    snapshotId,
    metric,
    timeframe,
    aggregation,
    rollup
  });
}


export const getMetricForFocusedMoment = memoize(
  ({snapshotId, metric}) => {
    return focusedMoment$.flatMap(focusedMoment => {
      if (focusedMoment == null) {
        return getLiveMetrics({snapshotId, metric});
      }

      return getHistoricMetric({snapshotId, metric, time: focusedMoment});
    });
  },

  ({snapshotId, metric}) => snapshotId + metric
);


export function getHistoricMetric({snapshotId, metric, time}) {
  const now = Date.now();
  const availableRollupDefinitions = rollupDurationThresholds.filter(rollupDefinition =>
    time >= now - rollupDefinition.availableFor && rollupDefinition.rollup != null
  );
  const rollup = availableRollupDefinitions[0].rollup;

  let aggregation = null;
  if (rollup) {
    aggregation = getAggregation(metric);
  }

  return createHistoricMetricObservable({
    snapshotId,
    metric,
    aggregation,
    rollup,
    time
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
  .map(getRollupForTimeframe);


export function getRollupForTimeframe(timeframe) {
  const rollup = getDefaultMetricRollupDuration(timeframe);

  for (let i = 0, len = rollupDurationThresholds.length; i < len; i++) {
    if (rollupDurationThresholds[i].rollup === rollup) {
      return rollupDurationThresholds[i].label;
    }
  }

  return 'Unknown rollup';
}


export const activeMetric = createStore({
  name: 'metric',
  initialValue: null
});

export const activeMetric$ = activeMetric.observable.distinct();

export function setActiveMetric(metric) {
  activeMetric.applyStateMutation(() => metric);
}

export function clearActiveMetric() {
  setActiveMetric(null);
}

export function getPixelAwareRollupSize(timeframe, pixels) {
  const now = Date.now();
  const to = timeframe.to ? timeframe.to : now;
  const from = to - timeframe.windowSize;
  const maxNumberOfDataPoints = pixels * (window.devicePixelRatio || 1);
  const availableRollupDefinitions = rollupDurationThresholds.filter(rollupDefinition =>
    from >= now - rollupDefinition.availableFor
  );

  for (let i = 0, len = availableRollupDefinitions.length; i < len; i++) {
    // this works because the rollupDurationThresholds array is sorted by rollup
    // the first rollup matching the requirements is returned
    const rollupDefinition = availableRollupDefinitions[i];
    const rollup = rollupDefinition.rollup || 1000;
    if (timeframe.windowSize / rollup <= maxNumberOfDataPoints) {
      return rollupDefinition.rollup;
    }
  }

  return rollupDurationThresholds[rollupDurationThresholds.length - 1].rollup;
}
