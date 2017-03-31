import { fromJS } from 'immutable';

import http from 'in-services/http';

export function getRoles() {
  return http({
    method: 'GET',
    url: `/api/roles`
  }).map(response => fromJS(response.body));
}

export function getRole(roleId) {
  return http({
    method: 'GET',
    url: `/api/roles/${encodeURIComponent(roleId)}`
  }).map(response => fromJS(response.body));
}

export function saveRole(role) {
  return http({
    method: 'PUT',
    url: `/api/roles/${encodeURIComponent(role.get('id'))}`,
    data: role.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRole(roleId) {
  return http({
    method: 'DELETE',
    url: `/api/roles/${encodeURIComponent(roleId)}`
  }).map(response => fromJS(response.body));
}
