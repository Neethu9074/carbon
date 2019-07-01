import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
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

export function getWebsites() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/permission-sets/websites'
  }).map(response => response.body);
}

export function getK8sClusters() {
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/kubernetes/clusters',
    data: defaultQuery()
  }).map(response => response.body.items);
}

export function getK8sNamespaces() {
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/kubernetes/namespaces',
    data: defaultQuery()
  }).map(response => response.body.items);
}

function defaultQuery() {
  return {
    filter: { timeConfig: {} },
    pagination: { page: 1, pageSize: 200 },
    order: { by: 'name', direction: 'ASC' }
  };
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

export function createPermissionSet(
  name = 'New Scope',
  permissions = [],
  applicationIds = [],
  kubernetesClusterUUIDs = [],
  kubernetesNamespaceUIDs = [],
  websiteIds = []
) {
  return {
    id: null,
    name,
    permissions,
    applicationIds,
    kubernetesClusterUUIDs,
    kubernetesNamespaceUIDs,
    websiteIds
  };
}
