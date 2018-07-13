import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

export function getMetrics(metric, from, to, snapshotId, rollup) {
  return http({
    method: 'GET',
    maxRetries: 1,
    url: `/api/metrics`,
    queryParams: {
      metric,
      from,
      to,
      snapshotId,
      rollup
    }
  }).map(response => deepFreeze(response.body));
}
