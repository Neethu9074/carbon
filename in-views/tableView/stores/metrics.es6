import {createStore} from 'in-stores/store';


const metricsStore = createStore({
  name: 'tableView/stores/metrics',
  initialValue: []
});
export const metrics$ = metricsStore.observable;

export function addMetric(metric) {
  metricsStore.applyStateMutation(metrics => {
    if (metrics.indexOf(metric) !== -1) {
      return metrics;
    }
    const result = metrics.slice();
    result.unshift(metric);
    return result;
  });
}

export function removeMetric(metric) {
  metricsStore.applyStateMutation(metrics => {
    const i = metrics.indexOf(metric);
    if (i === -1) {
      return metrics;
    }
    const result = metrics.slice();
    result.splice(i, 1);
    return result;
  });
}

export function clearMetrics() {
  metricsStore.mutateTo([]);
}
