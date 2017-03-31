import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getAuditLog(offset, query) {
  return http({
    method: 'GET',
    url: `/api/auditlog`,
    queryParams: {
      offset,
      query
    }
  }).map(response => fromJS(response.body));
}
