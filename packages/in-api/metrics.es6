import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getMetrics(snapshotId, metric, timeConfig, rollup) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/metrics`,
    queryParams: {
      metric: metric,
      windowSize: timeConfig.windowSize,
      from: timeConfig.from,
      to: timeConfig.to,
      focusedMoment: timeConfig.focusedMoment,
      rollup: rollup,
      snapshotId: snapshotId
    }
  }).map(response => fromJS(response.body));
}
