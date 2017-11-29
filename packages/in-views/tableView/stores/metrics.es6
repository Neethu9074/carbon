import { setOrDeleteMatrixKey, navigationParameters$ } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

export const metrics$ = createTrackingStore({
  name: 'tableView/stores/metrics',
  observable: navigationParameters$
    .map(params => {
      const encodedMetrics = params.matrix.metrics;
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
    setOrDeleteMatrixKey('metrics', metrics.join(','));
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
    setOrDeleteMatrixKey('metrics', metrics.join(','));
  });
}

export function clearMetrics() {
  setOrDeleteMatrixKey('metrics');
}
