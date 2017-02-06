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


export function removeUserFromTenant(userId) {
  return http({
    method: 'DELETE',
    url: `/api/tenant/users/${encodeURIComponent(userId)}`
  });
}


export function sendInvitation(email, roleId) {
  return http({
    method: 'POST',
    url: `/api/tenant/users/invitations`,
    queryParams: {
      email,
      roleId
    }
  });
}


export function revokeInvitation(email) {
  return http({
    method: 'DELETE',
    url: `/api/tenant/users/invitations`,
    queryParams: {
      email
    }
  });
}
