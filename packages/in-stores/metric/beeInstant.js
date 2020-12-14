import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { days, hours, minutes, seconds } from 'in-services/time';
import { fixateTimeConfig } from 'in-stores/time/config';
import { createTrackingStore } from 'in-stores/store';

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
  SUM: 'sum'
};
