import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { createTracker } from 'in-services/tracking/mixpanel';
import { createTrackingStore } from 'in-stores/store';

const mapMetricsAggregationTracker = createTracker('map.metrics.aggregation');

export const showAggregations$ = createTrackingStore({
  name: 'metric/showAggregations',
  observable: navigationParameters$
    // sa === show aggregations
    .map(params => params.query.sa === '1')
    .distinct()
}).observable;

export function toggle() {
  mutateUrl(params => {
    if (params.query.sa === '1') {
      mapMetricsAggregationTracker({ enabled: false });
      delete params.query.sa;
    } else {
      mapMetricsAggregationTracker({ enabled: true });
      params.query.sa = '1';
    }
  });
}
