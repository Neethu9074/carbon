import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { mutateUrl, navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const metrics$ = createTrackingStore({
  name: 'tableView/stores/metrics',
  observable: navigationParameters$
    .map(location => {
      const encodedMetrics = getMatrixParameter(location, '/table', 'metrics');
      if (!encodedMetrics) {
        return [];
      }

      return encodedMetrics.split(',');
    })
    .distinct()
}).observable;

export function addMetric(metric) {
  metrics$.once(metrics => {
    metrics = metrics.slice();
    metrics.push(metric);
    mutateUrl(location => setOrDeleteMatrixKey(location, '/table', 'metrics', metrics.join(',')));
  });
}

export function removeMetric(metric) {
  metrics$.once(metrics => {
    const i = metrics.indexOf(metric);
    if (i === -1) {
      return metrics;
    }
    const result = metrics.slice();
    result.splice(i, 1);
    mutateUrl(location => setOrDeleteMatrixKey(location, '/table', 'metrics', result.join(',')));
  });
}

export function clearMetrics() {
  mutateUrl(location => setOrDeleteMatrixKey(location, '/table', 'metrics'));
}
