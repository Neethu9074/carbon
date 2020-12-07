import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

export const getRolesAsResultObservable = memoize(getRolesInternal, () => '', 60000);

function getRolesInternal() {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/roles`
      })
    )
  );
}

export function getRoles() {
  return getRolesMutable().map(fromJS);
}

export function getRolesMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/roles`
  }).map(response => response.body);
}

export function getRole(roleId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/roles/${encodeURIComponent(roleId)}`
  }).map(response => fromJS(response.body));
}

export function saveRole(role) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/roles/${encodeURIComponent(role.get('id'))}`,
    data: role.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRole(roleId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/roles/${encodeURIComponent(roleId)}`
  }).map(response => fromJS(response.body));
}

export function createRole(id, name = 'New Role') {
  return {
    id: id || generateUniqueShortId(),
    name
  };
}
