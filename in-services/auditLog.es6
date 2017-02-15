import {fromJS} from 'immutable';

import http from 'in-services/http';


export function getAuditLog() {
  return http({
    method: 'GET',
    url: `/api/auditlog`
  })
  .map(response => fromJS(response.body));
}
