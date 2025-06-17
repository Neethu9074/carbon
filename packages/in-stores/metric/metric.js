/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { just } from '@instana/observables';

import { beeInstanaInfraMetricsEnabled, highResolutionInfrastructureMetricsEnabled } from 'in-services/featureFlags';
import { fixateTimeConfig, timeConfig$, timeConfigShiftedForIngestion } from 'in-stores/time/config';
import createTimeWindowMetricAggregation from 'in-subscription/timeWindowMetricAggregation';
import createLatestMetricsObservable from 'in-subscription/latestMetrics';
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { days, hours, minutes, seconds } from 'in-services/time';
import createMetricsObservable from 'in-subscription/metrics';
import { createStore } from 'in-stores/store';
import { t } from 'in-i18n';

export const aggregationLabels = {
  MEAN: t('aggregation', { context: 'MEAN' }),
  MIN: t('aggregation', { context: 'MIN' }),
  P25: t('aggregation', { context: 'P25' }),
  P50: t('aggregation', { context: 'P50' }),
  P75: t('aggregation', { context: 'P75' }),
  P90: t('aggregation', { context: 'P90' }),
  P95: t('aggregation', { context: 'P95' }),
  P98: t('aggregation', { context: 'P98' }),
  P99: t('aggregation', { context: 'P99' }),
  MAX: t('aggregation', { context: 'MAX' }),
  DISTINCT_COUNT: t('aggregation', { context: 'DISTINCT_COUNT' }),
  SUM: t('aggregation', { context: 'SUM' }),
  INCREASE: t('in-stores:metric.metric', { context: 'INCREASE' }),
  DISTRIBUTION: t('aggregation', { context: 'DISTRIBUTION' }),
  PER_SECOND: t('aggregation', { context: 'PER_SECOND' })
};

export function hasIcon(aggregation) {
  return aggregation !== 'PER_SECOND' || aggregation !== 'INCREASE';
}

export const aggregationIcons = {
  MEAN: 'lib_mean',
  DISTINCT_COUNT: 'lib_sum',
  SUM: 'lib_sum'
};

/**
 * Granularities that we want to use by default depending on the chosen timeframes.
 * <p>
 * <strong>This needs to be kept in sync with the backend</strong>, in order to ensure that charts and big-number KPIs show
 * comparable data based on the same timeframes that could otherwise due to the timeframe-adjustment to remove partial buckets:
 * <a href="https://github.ibm.com/instana/backend/blob/2f1e83755c6a1096544997c5a0e0893d3975d851/metrics/metrics-core/src/main/java/com/instana/metrics/BaseGranularity.java#L26-L41">BaseGranularity</>
 * <p>
 * Furthermore, the following granularities are not listed here, because they might only be used in specific cases explicitly,
 * such as Smart Alert charts or charts in Synthetics dashboards, where such granularities are explicitly used for e.g. the
 * evaluation interval, or test interval. However, we don't want to globally use them as a default granularity, because that would
 * mean that e.g. the 24h chart in AP dashboards would use 20min instead of 30min chart, where we would benefit from the
 * 30m mat-views, but otherwise would fall back to use the 1m mat-views instead.
 */
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

const MINIMUM_GRANULARITY = 1000;
const MINIMUM_INFRA_GRANULARITY = highResolutionInfrastructureMetricsEnabled ? 1000 : 10000;
const DEFAULT_MAX_DATAPOINTS = 80;
const MAXIMUM_INFRA_DATAPOINTS = 800;

export function getChartGranularity(
  { windowSize },
  maxDataPoints = DEFAULT_MAX_DATAPOINTS,
  minGranularity = MINIMUM_GRANULARITY
) {
  const granularity = sensibleGranularities.find(
    granularity => windowSize / granularity <= maxDataPoints && granularity >= minGranularity
  );
  return granularity || sensibleGranularities[sensibleGranularities.length - 1];
}

const INFRA_GRANULARITIES = [
  {
    availableFor: days.toMillis(1),
    granularity: seconds.toMillis(1),
    highResolution: true
  },
  {
    availableFor: days.toMillis(1),
    granularity: seconds.toMillis(5),
    highResolution: true
  },
  {
    granularity: seconds.toMillis(10),
    availableFor: days.toMillis(1),
    beeInstanaOnly: true
  },
  {
    availableFor: days.toMillis(31),
    granularity: minutes.toMillis(1)
  },
  {
    availableFor: days.toMillis(31 * 3), // 3 months
    granularity: minutes.toMillis(5)
  },
  {
    availableFor: Number.MAX_VALUE, // forever
    granularity: hours.toMillis(1)
  }
]
  .filter(granularityIsSupported)
  .sort((l, r) => r.granularity - l.granularity);

const getLatestMetrics = resolveTimeConfigAndRollup(createLatestMetricsObservable);

export const getMetricsForTimeframe = resolveTimeConfigAndRollup(createMetricsObservable);

function resolveTimeConfigAndRollup(createFn) {
  return ({ timeConfig, rollup, ...rest }) =>
    resolveTimeConfig(timeConfig).flatMap(timeConfig =>
      createFn({
        timeConfig: timeConfigShiftedForIngestion(timeConfig),
        rollup: getInfraGranularity(timeConfig, rollup),
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

export const getMetric = memoize(
  ({ snapshotId, metric, timeWindowAggregation, forceTimeWindowAggregation, timeConfig, rollup, windowForLatest }) => {
    if (!timeWindowAggregation) {
      return getMetricForFocusedMoment({ snapshotId, metric, windowForLatest });
    }

    return showAggregations$
      .flatMap(showAggregations => {
        if (showAggregations || forceTimeWindowAggregation) {
          return getTimeWindowBasedMetricAggregation({ snapshotId, metric, rollup, timeWindowAggregation });
        }

        if (timeConfig) {
          return getHistoricMetric({ snapshotId, metric, timeConfig, rollup, windowForLatest }).map(v => v[1]);
        }
        return getMetricForFocusedMoment({ snapshotId, metric, rollup, windowForLatest }).map(v => v[1]);
      })
      .distinct();
  },
  ({ snapshotId, metric, timeWindowAggregation, timeConfig, rollup }) =>
    snapshotId +
    metric +
    timeWindowAggregation +
    (timeConfig
      ? timeConfig.to + timeConfig.focusedMoment + timeConfig.windowSize + timeConfig.autoRefresh
      : '' + rollup),
  500
);

export const getMetricForFocusedMoment = memoize(
  ({ snapshotId, metric, windowForLatest, rollup }) => {
    return getLatestMetrics({ snapshotId, metric, rollup, windowForLatest });
  },
  ({ snapshotId, metric }) => snapshotId + metric,
  500
);

export function getHistoricMetric({ snapshotId, metric, timeConfig, rollup, windowForLatest }) {
  return getLatestMetrics({
    snapshotId,
    metric,
    rollup,
    timeConfig,
    windowForLatest
  });
}

export function getInfraGranularity(
  timeConfig,
  minGranularity = MINIMUM_INFRA_GRANULARITY,
  maxDataPoints = MAXIMUM_INFRA_DATAPOINTS
) {
  const fallbackGranularity = INFRA_GRANULARITIES[0].granularity;
  if (!timeConfig) return fallbackGranularity;

  const desiredGranularity = getChartGranularity(
    timeConfig,
    Math.min(maxDataPoints, MAXIMUM_INFRA_DATAPOINTS),
    Math.max(minGranularity, MINIMUM_INFRA_GRANULARITY)
  );

  const availableGranularities = getAvailableGranularities(timeConfig);

  if (availableGranularities.length == 0) return fallbackGranularity;

  const finestAvailableGranularity = availableGranularities[availableGranularities.length - 1].granularity;
  const base = availableGranularities.find(g => g.granularity <= desiredGranularity)?.granularity;

  if (!base) return finestAvailableGranularity;

  return Math.floor(desiredGranularity / base) * base;
}

function getAvailableGranularities(timeConfig) {
  const { to, windowSize } = fixateTimeConfig(timeConfig);
  const from = to - windowSize;
  const metricAge = Date.now() - from;

  return INFRA_GRANULARITIES.filter(g => g.availableFor > metricAge);
}

export function getFinestAvailableGranularity(timeConfig, minimumGranularity = MINIMUM_INFRA_GRANULARITY) {
  const availableGranularities = getAvailableGranularities(timeConfig);

  if (availableGranularities.length == 0) return INFRA_GRANULARITIES[0].granularity;

  return Math.max(availableGranularities[availableGranularities.length - 1].granularity, minimumGranularity);
}

export const currentRollup$ = timeConfig$.map(getInfraGranularity);

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
  const maxNumberOfDataPoints = pixels * (window.devicePixelRatio || 1);
  return getInfraGranularity(timeConfig, MINIMUM_INFRA_GRANULARITY, maxNumberOfDataPoints);
}

export function getTimeWindowBasedMetricAggregation({ snapshotId, metric, rollup, timeWindowAggregation, timeConfig }) {
  return timeConfig
    ? getTimeWindowMetricAggregationSubscription(timeConfig, snapshotId, metric, rollup, timeWindowAggregation)
    : timeConfig$.flatMap(_timeConfig =>
        getTimeWindowMetricAggregationSubscription(_timeConfig, snapshotId, metric, rollup, timeWindowAggregation)
      );
}

function getTimeWindowMetricAggregationSubscription(timeConfig, snapshotId, metric, rollup, timeWindowAggregation) {
  return createTimeWindowMetricAggregation({
    snapshotId,
    metric,
    timeConfig,
    rollup: getInfraGranularity(timeConfig, rollup),
    timeWindowAggregation
  });
}

function granularityIsSupported(granularity) {
  return !(
    (granularity.highResolution && !highResolutionInfrastructureMetricsEnabled) ||
    (granularity.beeInstanaOnly && !beeInstanaInfraMetricsEnabled)
  );
}
