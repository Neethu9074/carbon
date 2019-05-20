import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getErrorsForWebsite({ websiteSnapshotId, timeConfig, pageHash }) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/eum/errors',
    queryParams: {
      snapshotId: websiteSnapshotId,
      to: timeConfig.to,
      windowSize: timeConfig.windowSize,
      pageHash
    }
  }).map(response => fromJS(response.body));
}

export function getErrorBreakdownForWebsite({ websiteSnapshotId, errorHash, timeConfig, pageHash }) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/eum/errors/${encodeURIComponent(errorHash)}`,
    queryParams: {
      snapshotId: websiteSnapshotId,
      to: timeConfig.to,
      windowSize: timeConfig.windowSize,
      pageHash
    }
  }).map(response => fromJS(response.body));
}
