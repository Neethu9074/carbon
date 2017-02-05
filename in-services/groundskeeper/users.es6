import {fromJS} from 'immutable';

import http from 'in-services/http';

export function getUsers() {
  return http({
    method: 'GET',
    url: `/api/tenant/users/overview`
  })
  .map(response => fromJS(response.body));
}


export function setRole(userId, roleId) {
  return http({
    method: 'PUT',
    url: `/api/tenant/users/${encodeURIComponent(userId)}/role`,
    queryParams: {
      roleId
    }
  });
}
