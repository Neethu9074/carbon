import createDynamicAggregatedMetricObservable from 'in-subscription/dynamicAggregatedMetric';
import createTimeWindowMetricAggregation from 'in-subscription/timeWindowMetricAggregation';
import createHistoricMetricsObservable from 'in-subscription/historicMetrics';
import createHistoricMetricObservable from 'in-subscription/historicMetric';
import createLiveMetricObservable from 'in-subscription/liveMetric';
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { timeConfig$ } from 'in-stores/time/config';
import { createStore } from 'in-stores/store';

const MAX_NUMBER_OF_METRICS_FOR_CHARTS = 800;

export const aggregationLabels = {
  MEAN: 'mean',
  MIN: 'min',
  P25: '25th',
  P50: '50th',
  P75: '75th',
  P90: '90th',
  P95: '95th',
  P98: '98th',
  P99: '99th',
  MAX: 'max',
  DISTINCT_COUNT: 'distinct count',
  SUM: 'sum'
};

export const dynamicRollupPredefinitions = [
  1000,
  1000 * 5,
  1000 * 10,
  1000 * 20,
  1000 * 30,
  1000 * 60,
  1000 * 60 * 5,
  1000 * 60 * 10,
  1000 * 60 * 20,
  1000 * 60 * 30,
  1000 * 60 * 60,
  1000 * 60 * 90,
  1000 * 60 * 60 * 2,
  1000 * 60 * 60 * 6,
  1000 * 60 * 60 * 12,
  1000 * 60 * 60 * 24,
  1000 * 60 * 60 * 24 * 7
];

const rollupDurationThresholds = [
  {
    availableFor: 1000 * 60 * 60 * 24,
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

function getLiveMetrics({ snapshotId, metric, timeConfig = null, rollup }) {
  if (rollup === undefined) {
    rollup = getDefaultMetricRollupDuration(timeConfig).rollup;
  }

  return createLiveMetricObservable({
    snapshotId,
    metric,
    rollup
  });
}

function getHistoricMetrics({ snapshotId, metric, timeConfig, rollup }) {
  if (timeConfig) {
    return createHistoricMetricsObservable({
      snapshotId,
      metric,
      timeConfig,
      rollup: rollup === undefined ? getDefaultMetricRollupDuration(timeConfig).rollup : rollup
    });
  }

  return timeConfig$.flatMap(timeConfig =>
    createHistoricMetricsObservable({
      snapshotId,
      metric,
      timeConfig,
      rollup: rollup === undefined ? getDefaultMetricRollupDuration(timeConfig).rollup : rollup
    })
  );
}

export const getMetric = memoize(
  ({ snapshotId, metric, timeWindowAggregation, forceTimeWindowAggregation }) => {
    if (!timeWindowAggregation) {
      return getMetricForFocusedMoment({ snapshotId, metric });
    }

    return showAggregations$
      .flatMap(showAggregations => {
        if (showAggregations || forceTimeWindowAggregation) {
          return getTimeWindowBasedMetricAggregation({
            snapshotId: snapshotId,
            metric: metric,
            timeWindowAggregation: timeWindowAggregation
          });
        }

        return getMetricForFocusedMoment({ snapshotId, metric }).map(v => v[1]);
      })
      .distinct();
  },
  ({ snapshotId, metric, timeWindowAggregation }) => snapshotId + metric + timeWindowAggregation,
  500
);

export const getMetricForFocusedMoment = memoize(
  ({ snapshotId, metric }) => {
    return timeConfig$.flatMap(timeConfig => {
      if (timeConfig.autoRefresh) {
        return getLiveMetrics({ snapshotId, metric });
      }

      return getHistoricMetric({ snapshotId, metric, timeConfig });
    });
  },
  ({ snapshotId, metric }) => snapshotId + metric,
  500
);

export function getHistoricMetric({ snapshotId, metric, timeConfig }) {
  const now = Date.now();
  const resolvedFocusedMoment = timeConfig.focusedMoment || now;
  const availableRollupDefinitions = rollupDurationThresholds.filter(
    rollupDefinition => resolvedFocusedMoment >= now - rollupDefinition.availableFor && rollupDefinition.rollup != null
  );
  const rollup = availableRollupDefinitions[0].rollup;

  return createHistoricMetricObservable({
    snapshotId,
    metric,
    rollup,
    timeConfig
  });
}

function getHistoricMetricsWithLiveUpdates(opts) {
  const live$ = getLiveMetrics(opts)
    // bring the two streams into the same format
    .map(update => [update]);
  const historic$ = getHistoricMetrics(opts);
  return live$.merge(historic$);
}

export function getMetricsForTimeframe(opts) {
  if (opts.isDynamicAggregated) {
    // live or not is done in the backend
    return getDynamicAggregatedMetricsForTimeframe(opts);
  }
  if (opts.timeConfig.autoRefresh) {
    return getHistoricMetricsWithLiveUpdates(opts);
  }
  return getHistoricMetrics(opts);
}

export function getDynamicAggregatedMetricsForTimeframe(opts) {
  return createDynamicAggregatedMetricObservable(opts);
}

export function getDefaultMetricRollupDuration(timeConfig, minRollup = 1000) {
  if (!timeConfig) {
    return rollupDurationThresholds[0];
  }

  // Ignoring time differences for now since small time differences
  // can be accepted. This time is only used to calculate the rollup.
  const now = Date.now();
  const to = timeConfig.to ? timeConfig.to : now;
  const from = to - timeConfig.windowSize;

  let availableRollupDefinitions = rollupDurationThresholds.filter(
    rollupDefinition => from >= now - rollupDefinition.availableFor
  );
  if (minRollup > 1000) {
    availableRollupDefinitions = availableRollupDefinitions.filter(
      rollupDefinition => rollupDefinition.rollup != null && rollupDefinition.rollup >= minRollup
    );
  }

  for (let i = 0, len = availableRollupDefinitions.length; i < len; i++) {
    // this works because the rollupDurationThresholds array is sorted by rollup
    // the first rollup matching the requirements is returned
    const rollupDefinition = availableRollupDefinitions[i];
    const rollup = rollupDefinition && rollupDefinition.rollup ? rollupDefinition.rollup : 1000;
    if (timeConfig.windowSize / rollup <= MAX_NUMBER_OF_METRICS_FOR_CHARTS) {
      return rollupDefinition;
    }
  }

  return rollupDurationThresholds[rollupDurationThresholds.length - 1];
}

export const currentRollup$ = timeConfig$.map(getRollupForTimeframe);

export function getRollupForTimeframe(timeConfig) {
  const rollup = getDefaultMetricRollupDuration(timeConfig).rollup;

  for (let i = 0, len = rollupDurationThresholds.length; i < len; i++) {
    if (rollupDurationThresholds[i].rollup === rollup) {
      return rollupDurationThresholds[i];
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

export function getPixelAwareRollupSize(timeConfig, pixels) {
  const now = Date.now();
  const to = timeConfig.to ? timeConfig.to : now;
  const from = to - timeConfig.windowSize;
  const maxNumberOfDataPoints = pixels * (window.devicePixelRatio || 1);
  const availableRollupDefinitions = rollupDurationThresholds.filter(
    rollupDefinition => from >= now - rollupDefinition.availableFor
  );

  for (let i = 0, len = availableRollupDefinitions.length; i < len; i++) {
    // this works because the rollupDurationThresholds array is sorted by rollup
    // the first rollup matching the requirements is returned
    const rollupDefinition = availableRollupDefinitions[i];
    const rollup = rollupDefinition && rollupDefinition.rollup ? rollupDefinition.rollup : 1000;
    if (timeConfig.windowSize / rollup <= maxNumberOfDataPoints) {
      return rollupDefinition.rollup;
    }
  }

  return rollupDurationThresholds[rollupDurationThresholds.length - 1].rollup;
}

export function getTimeWindowBasedMetricAggregation({ snapshotId, metric, timeWindowAggregation, timeConfig }) {
  return timeConfig
    ? getTimeWindowMetricAggregationSubscription(timeConfig, snapshotId, metric, timeWindowAggregation)
    : timeConfig$.flatMap(_timeConfig =>
        getTimeWindowMetricAggregationSubscription(_timeConfig, snapshotId, metric, timeWindowAggregation)
      );
}

function getTimeWindowMetricAggregationSubscription(timeConfig, snapshotId, metric, timeWindowAggregation) {
  const rollup = getDefaultMetricRollupDuration(timeConfig).rollup;

  return createTimeWindowMetricAggregation({
    snapshotId,
    metric,
    timeConfig,
    rollup,
    timeWindowAggregation
  });
}
