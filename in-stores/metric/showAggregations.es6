import {navigationParameters$, mutateUrl} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';


export const showAggregations$ = createTrackingStore({
  name: 'metric/showAggregations',
  observable: navigationParameters$
    // sa === show aggregations
    .map(params => {
      return params.query.sa === '1';
    })
    .distinct()
}).observable;


export function toggle() {
  mutateUrl(params => {
    if (params.query.sa === '1') {
      delete params.query.sa;
    } else {
      params.query.sa = '1';
    }
  });
}
