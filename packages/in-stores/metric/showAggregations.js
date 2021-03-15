/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { track, MAP_METRICS_AGGREGATION } from 'in-services/tracking/tracking';
import { navigationParameters$, mutateUrl } from 'in-stores/navigation';
import { createTrackingStore } from 'in-stores/store';

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
      track(MAP_METRICS_AGGREGATION, { enabled: false });
      delete params.query.sa;
    } else {
      track(MAP_METRICS_AGGREGATION, { enabled: true });
      params.query.sa = '1';
    }
  });
}
