import { fromJS } from 'immutable';

import { twoZeroModeEnabled } from 'in-services/featureFlags';
import http from 'in-services/http';

export function searchSnapshots(query, timeConfig, maxResults) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/snapshots`,
    queryParams: {
      time: timeConfig.to,
      from: timeConfig.from,
      to: timeConfig.to,
      q: query,
      size: maxResults,
      newApplicationModelEnabled: twoZeroModeEnabled
    }
  }).map(response => fromJS(response.body));
}

export function getSnapshot(snapshotId, timeConfig) {
  return http({
    method: 'GET',
    url: `/api/snapshots/${encodeURIComponent(snapshotId)}`,
    maxRetries: 3,
    queryParams: {
      time: timeConfig.to
    }
  }).map(response => fromJS(response.body));
}
