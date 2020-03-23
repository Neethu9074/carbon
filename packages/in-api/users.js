import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

export function getUsersAndInvitations() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users/overview`
  }).map(response => fromJS(response.body));
}

export function getUsers() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users`
  }).map(response => response.body);
}

export const getUsersAsResultObservable = memoize(getUsersAsResultObservableInternal, () => '', 60000);
function getUsersAsResultObservableInternal() {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/users`
    })
  );
}

export function getInvitations() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/users/invitations`
  }).map(response => response.body);
}

export function setRole(userId, roleId) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/users/${encodeURIComponent(userId)}/role`,
    headers: getCsrfHeader(),
    queryParams: {
      roleId
    }
  });
}

export function removeUserFromTenant(userId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/users/${encodeURIComponent(userId)}`
  });
}

export function sendInvitation(email, roleId) {
  return http({
    method: 'POST',
    url: `/api/settings/users/invitations`,
    headers: getCsrfHeader(),
    queryParams: {
      email,
      roleId
    }
  });
}

export function revokeInvitation(email) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/users/invitations`,
    headers: getCsrfHeader(),
    queryParams: {
      email
    }
  });
}
