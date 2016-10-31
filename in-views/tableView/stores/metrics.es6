import {createStore} from 'in-stores/store';


const metricsStore = createStore({
  name: 'in-views/tableView/stores/metrics',
  initialValue: []
});
export const metrics$ = metricsStore.observable;

export function addMetric(metric) {
  metricsStore.applyStateMutation(metrics => {
    if (metrics.indexOf(metric) !== -1) {
      return metrics;
    }
    const result = metrics.slice();
    result.push(metric);
    return result;
  });
}
