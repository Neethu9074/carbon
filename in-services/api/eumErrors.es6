import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getErrorsForWebsite({ websiteSnapshotId, timeframe }) {
  return http({
    method: 'GET',
    url: '/api/eum/errors',
    queryParams: {
      snapshotId: websiteSnapshotId,
      to: timeframe.to,
      windowSize: timeframe.windowSize
    }
  }).map(response => fromJS(response.body));
}

export function getErrorBreakdownForWebsite({ websiteSnapshotId, errorHash, timeframe }) {
  return http({
    method: 'GET',
    url: `/api/eum/errors/${encodeURIComponent(errorHash)}`,
    queryParams: {
      snapshotId: websiteSnapshotId,
      to: timeframe.to,
      windowSize: timeframe.windowSize
    }
  }).map(response => fromJS(response.body));
}
