import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getErrorsForWebsite({ websiteSnapshotId, timeframe, pageHash }) {
  return http({
    method: 'GET',
    url: '/api/eum/errors',
    queryParams: {
      snapshotId: websiteSnapshotId,
      to: timeframe.to,
      windowSize: timeframe.windowSize,
      pageHash
    }
  }).map(response => fromJS(response.body));
}

export function getErrorBreakdownForWebsite({ websiteSnapshotId, errorHash, timeframe, pageHash }) {
  return http({
    method: 'GET',
    url: `/api/eum/errors/${encodeURIComponent(errorHash)}`,
    queryParams: {
      snapshotId: websiteSnapshotId,
      to: timeframe.to,
      windowSize: timeframe.windowSize,
      pageHash
    }
  }).map(response => fromJS(response.body));
}
