import {navigationParameters$} from 'in-stores/navigation';
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
