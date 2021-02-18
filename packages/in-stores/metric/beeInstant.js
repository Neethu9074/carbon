/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { days, hours, minutes, seconds } from 'in-services/time';
import { fixateTimeConfig } from 'in-stores/time/config';
import { createTrackingStore } from 'in-stores/store';
import { t } from 'in-i18n';

export const useBeeInstant$ = createTrackingStore({
  name: 'metric/useBeeInstant',
  observable: navigationParameters$
    .map(params => {
      const beeInstant = params.query.beeInstant === '1';
      return beeInstant;
    })
    .distinct()
}).observable;

export function setUseBeeInstant() {
  mutateUrl(params => {
    if (params.query.beeInstant === '1') {
      delete params.query.beeInstant;
    } else {
      params.query.beeInstant = '1';
    }
  });
}

export const DEFAULT_STAT = 'avg';

export const MINIMUM_GRANULARITY = 10 * 1000;

const months = { toMillis: _months => _months * days.toMillis(30) };

// see https://github.com/instana/moncore/blob/master/src/Common.h#L16
export const BEEINSTANT_GRANULARITIES = [
  {
    granularity: hours.toMillis(1),
    availableFor: months.toMillis(13)
  },
  {
    granularity: minutes.toMillis(5),
    availableFor: months.toMillis(3)
  },
  {
    granularity: minutes.toMillis(1),
    availableFor: months.toMillis(1)
  },
  {
    granularity: seconds.toMillis(10),
    availableFor: days.toMillis(1)
  }
];

export const FALLBACK_GRANULARITY = BEEINSTANT_GRANULARITIES[0].granularity;

export function granularityForBeeInstantMetrics(desiredGranularity, timeConfig) {
  if (!desiredGranularity || !timeConfig) return FALLBACK_GRANULARITY;

  const { to, windowSize } = fixateTimeConfig(timeConfig);
  const from = to - windowSize;
  const metricAge = Date.now() - from;
  const availableGranularities = BEEINSTANT_GRANULARITIES.filter(g => g.availableFor > metricAge);

  if (availableGranularities.length == 0) return FALLBACK_GRANULARITY;

  const bestAvailableGranularity = availableGranularities[availableGranularities.length - 1].granularity;
  const base = availableGranularities.find(g => g.granularity <= desiredGranularity)?.granularity;

  if (!base) return bestAvailableGranularity;

  return Math.floor(desiredGranularity / base) * base;
}

export const aggregationLabels = {
  MEAN: t('in-stores:metric.metric.MEAN'),
  MIN: t('in-stores:metric.metric.MIN'),
  P25: t('in-stores:metric.metric.P25'),
  P50: t('in-stores:metric.metric.P50'),
  P75: t('in-stores:metric.metric.P75'),
  P90: t('in-stores:metric.metric.P90'),
  P95: t('in-stores:metric.metric.P95'),
  P98: t('in-stores:metric.metric.P98'),
  P99: t('in-stores:metric.metric.P99'),
  MAX: t('in-stores:metric.metric.MAX'),
  SUM: t('in-stores:metric.metric.SUM')
};
