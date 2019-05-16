import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { kubernetesEnabled } from 'in-services/featureFlags';
import http from 'in-services/http';

export function getPermissionSets() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/permission-sets'
  }).map(response => response.body);
}

export function getApplications() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/permission-sets/applications'
  }).map(response => response.body);
}

export function getPermissionSet(permissionSetId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/permission-sets/${encodeURIComponent(permissionSetId)}`
  }).map(response => fromJS(response.body));
}

export function savePermissionSet(permissionSet) {
  let permissionSetId = permissionSet.get('id');
  return http({
    method: permissionSetId ? 'PUT' : 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: permissionSetId
      ? `/api/settings/permission-sets/${encodeURIComponent(permissionSetId)}`
      : '/api/settings/permission-sets',
    data: permissionSet.toJS()
  }).map(response => fromJS(response.body));
}

export function deletePermissionSet(permissionSetId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/permission-sets/${encodeURIComponent(permissionSetId)}`
  }).map(response => fromJS(response.body));
}

export function createPermissionSet(name = 'New Scope', permissions = [], applicationIds = []) {
  return {
    id: null,
    name,
    permissions,
    applicationIds
  };
}

export function getProductAreaPermissions() {
  let areas = [{ value: 'ACCESS_WEBSITES', label: 'Websites' }];
  if (kubernetesEnabled) {
    areas.push({ value: 'ACCESS_KUBERNETES', label: 'Kubernetes' });
  }
  return areas;
}
