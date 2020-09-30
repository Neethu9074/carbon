import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
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

export const MINIMUM_ROLLUP = 10 * 1000;

export function rollupForBeeInstantMetrics(rollup) {
  if (rollup >= MINIMUM_ROLLUP) {
    return rollup;
  }

  return MINIMUM_ROLLUP;
}
