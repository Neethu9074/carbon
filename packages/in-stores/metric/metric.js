/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { just } from '@instana/observables';

import { beeInstanaInfraMetricsEnabled, highResolutionInfrastructureMetricsEnabled } from 'in-services/featureFlags';
import createDynamicAggregatedMetricObservable from 'in-subscription/dynamicAggregatedMetric';
import createTimeWindowMetricAggregation from 'in-subscription/timeWindowMetricAggregation';
import createLatestMetricsObservable from 'in-subscription/latestMetrics';
import { showAggregations$ } from 'in-stores/metric/showAggregations';
import { timeConfig$, fixateTimeConfig } from 'in-stores/time/config';
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
  DISTRIBUTION: t('aggregation', { context: 'DISTRIBUTION' })
};

export const aggregationIcons = {
  MEAN: 'lib_mean',
  DISTINCT_COUNT: 'lib_sum',
  SUM: 'lib_sum'
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

const getMetrics = resolveTimeConfigAndRollup(createMetricsObservable);

function resolveTimeConfigAndRollup(createFn) {
  return ({ timeConfig, rollup, ...rest }) =>
    resolveTimeConfig(timeConfig).flatMap(timeConfig =>
      createFn({
        timeConfig,
        rollup: resolveRollup(rollup, timeConfig),
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

function resolveRollup(rollup, timeConfig) {
  const nonBeeInstantRollup = rollup || getInfraGranularity(timeConfig);
  return nonBeeInstantRollup;
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
  const rollup = getInfraGranularity(timeConfig);

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

  const { to, windowSize } = fixateTimeConfig(timeConfig);
  const from = to - windowSize;
  const metricAge = Date.now() - from;

  const availableGranularities = INFRA_GRANULARITIES.filter(g => g.availableFor > metricAge);

  if (availableGranularities.length == 0) return fallbackGranularity;

  const bestAvailableGranularity = availableGranularities[availableGranularities.length - 1].granularity;
  const base = availableGranularities.find(g => g.granularity <= desiredGranularity)?.granularity;

  if (!base) return bestAvailableGranularity;

  return Math.floor(desiredGranularity / base) * base;
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

export function getTimeWindowBasedMetricAggregation({ snapshotId, metric, timeWindowAggregation, timeConfig }) {
  return timeConfig
    ? getTimeWindowMetricAggregationSubscription(timeConfig, snapshotId, metric, timeWindowAggregation)
    : timeConfig$.flatMap(_timeConfig =>
        getTimeWindowMetricAggregationSubscription(_timeConfig, snapshotId, metric, timeWindowAggregation)
      );
}

function getTimeWindowMetricAggregationSubscription(timeConfig, snapshotId, metric, timeWindowAggregation) {
  const rollup = getInfraGranularity(timeConfig);

  return createTimeWindowMetricAggregation({
    snapshotId,
    metric,
    timeConfig,
    rollup,
    timeWindowAggregation
  });
}

function granularityIsSupported(granularity) {
  return !(
    (granularity.highResolution && !highResolutionInfrastructureMetricsEnabled) ||
    (granularity.beeInstanaOnly && !beeInstanaInfraMetricsEnabled)
  );
}
