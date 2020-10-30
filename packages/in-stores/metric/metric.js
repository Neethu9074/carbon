import { just, combineLatest } from 'reactive-observables';

import { useBeeInstant$, granularityForBeeInstantMetrics, DEFAULT_STAT } from 'in-stores/metric/beeInstant';
import createDynamicAggregatedMetricObservable from 'in-subscription/dynamicAggregatedMetric';
import createTimeWindowMetricAggregation from 'in-subscription/timeWindowMetricAggregation';
import createLatestMetricsObservable from 'in-subscription/latestMetrics';
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { days, hours, minutes, seconds } from 'in-services/time';
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

// Ensure that this is kept in sync with the backend:
// - https://github.com/instana/backend/blob/1f04be562b1310cbd7dd00ab3208c82042197b00/ui-backend/src/main/java/com/instana/ui/service/EventMetricService.java#L59
export const sensibleGranularities = [
  seconds.toMillis(1),
  seconds.toMillis(5),
  seconds.toMillis(10),
  minutes.toMillis(1),
  minutes.toMillis(5),
  minutes.toMillis(10),
  minutes.toMillis(30),
  hours.toMillis(1),
  // Choosing granularities as divisors of 24 for easier comparison between days
  hours.toMillis(4),
  hours.toMillis(6),
  hours.toMillis(8),
  hours.toMillis(12),
  days.toMillis(1),
  days.toMillis(5),
  days.toMillis(10)
];

const rollupDurationThresholds = [
  {
    availableFor: days.toMillis(1),
    rollup: null, // 1s
    label: '1s'
  },
  {
    availableFor: days.toMillis(1),
    rollup: seconds.toMillis(5),
    label: '5s'
  },
  {
    availableFor: days.toMillis(31),
    rollup: minutes.toMillis(1),
    label: '1min'
  },
  {
    availableFor: days.toMillis(31 * 3), // 3 months
    rollup: minutes.toMillis(5),
    label: '5min'
  },
  {
    availableFor: Number.MAX_VALUE, // forever
    rollup: hours.toMillis(1),
    label: '1h'
  }
];

const getLatestMetrics = resolveTimeConfigAndStat(createLatestMetricsObservable, true);

const getMetrics = resolveTimeConfigAndStat(createMetricsObservable, false);

function resolveTimeConfigAndStat(createFn, single) {
  return ({ timeConfig, rollup, stat, ...rest }) =>
    combineLatest([resolveTimeConfig(timeConfig), resolveStat(stat)]).flatMap(([timeConfig, stat]) =>
      createFn({
        timeConfig,
        rollup: resolveRollup(rollup, timeConfig, stat, single),
        stat,
        ...rest
      })
    );
}

function resolveTimeConfig(timeConfig) {
  if (timeConfig) {
    return just(timeConfig);
  } else {
    return timeConfig$;
  }
}

function resolveStat(stat) {
  return useBeeInstant$.map(useBeeInstant => {
    if (useBeeInstant) {
      return stat || DEFAULT_STAT;
    } else {
      return null;
    }
  });
}

function resolveRollup(rollup, timeConfig, stat, single) {
  const nonBeeInstantRollup = rollup || getDefaultMetricRollupDuration(timeConfig).rollup;
  if (stat) {
    if (single) {
      return granularityForBeeInstantMetrics(timeConfig.windowSize, timeConfig);
    } else {
      return granularityForBeeInstantMetrics(rollup, timeConfig);
    }
  } else {
    return nonBeeInstantRollup;
  }
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
