import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getUsers() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/tenant/users/overview`
  }).map(response => fromJS(response.body));
}

export function setRole(userId, roleId) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/tenant/users/${encodeURIComponent(userId)}/role`,
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
    url: `/api/tenant/users/${encodeURIComponent(userId)}`
  });
}

export function sendInvitation(email, roleId) {
  return http({
    method: 'POST',
    url: `/api/tenant/users/invitations`,
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
    url: `/api/tenant/users/invitations`,
    headers: getCsrfHeader(),
    queryParams: {
      email
    }
  });
}
