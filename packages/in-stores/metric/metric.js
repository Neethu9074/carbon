import createDynamicAggregatedMetricObservable from 'in-subscription/dynamicAggregatedMetric';
import createTimeWindowMetricAggregation from 'in-subscription/timeWindowMetricAggregation';
import createLatestMetricsObservable from 'in-subscription/latestMetrics';
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import memoize from 'in-services/util/memoizingObservableGenerator';
import createMetricsObservable from 'in-subscription/metrics';
import { timeConfig$ } from 'in-stores/time/config';
import { createStore } from 'in-stores/store';

export const MINIMUM_ROLLUP = 1000;

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

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;
export const sensibleGranularities = [
  second,
  5 * second,
  10 * second,
  minute,
  5 * minute,
  10 * minute,
  30 * minute,
  hour,
  // Choosing granularities as divisors of 24 for easier comparison between days
  4 * hour,
  6 * hour,
  8 * hour,
  12 * hour,
  day,
  5 * day,
  10 * day
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

const getLatestMetrics = resolveTimeConfig(createLatestMetricsObservable);

const getMetrics = resolveTimeConfig(createMetricsObservable);

function resolveTimeConfig(f) {
  return ({ timeConfig, rollup, ...rest }) => {
    if (timeConfig) {
      return f({
        timeConfig,
        rollup: rollup === undefined ? getDefaultMetricRollupDuration(timeConfig).rollup : rollup,
        ...rest
      });
    }

    return timeConfig$.flatMap(timeConfig =>
      f({
        timeConfig,
        rollup: rollup === undefined ? getDefaultMetricRollupDuration(timeConfig).rollup : rollup,
        ...rest
      })
    );
  };
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
    return getLatestMetrics({
      snapshotId,
      metric
    });
  },
  ({ snapshotId, metric }) => snapshotId + metric,
  500
);

export function getHistoricMetric({ snapshotId, metric, timeConfig }) {
  const rollup = getRollupForTimeframe(timeConfig).rollup || MINIMUM_ROLLUP;

  return getLatestMetrics({
    snapshotId,
    metric,
    rollup,
    timeConfig
  });
}

export function getMetricsForTimeframe(opts) {
  if (opts.isDynamicAggregated) {
    // live or not is done in the backend
    return getDynamicAggregatedMetricsForTimeframe(opts);
  }
  return getMetrics(opts);
}

export function getDynamicAggregatedMetricsForTimeframe(opts) {
  return createDynamicAggregatedMetricObservable(opts);
}

export function getDefaultMetricRollupDuration(timeConfig, minRollup = MINIMUM_ROLLUP) {
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
  if (minRollup > MINIMUM_ROLLUP) {
    availableRollupDefinitions = availableRollupDefinitions.filter(
      rollupDefinition => rollupDefinition.rollup != null && rollupDefinition.rollup >= minRollup
    );
  }

  for (let i = 0, len = availableRollupDefinitions.length; i < len; i++) {
    // this works because the rollupDurationThresholds array is sorted by rollup
    // the first rollup matching the requirements is returned
    const rollupDefinition = availableRollupDefinitions[i];
    const rollup = rollupDefinition && rollupDefinition.rollup ? rollupDefinition.rollup : MINIMUM_ROLLUP;
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

  throw new Error(`Unknown rollup for ${timeConfig}`);
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
    const rollup = rollupDefinition && rollupDefinition.rollup ? rollupDefinition.rollup : MINIMUM_ROLLUP;
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
