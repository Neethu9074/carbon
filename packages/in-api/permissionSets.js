import { create, just } from '@instana/observables';
import { fromJS } from 'immutable';

import { CAN_VIEW_LOGS, CAN_VIEW_TRACE_DETAILS } from 'in-stores/permission';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignalPermissionSets = create().emit(true);
export function refresh() {
  refreshSignalPermissionSets.emit(true);
}

// observables

export const getPermissionSetsAsResultObservable = memoize(getPermissionSetsInternal, () => '', 60000);
function getPermissionSetsInternal() {
  return refreshSignalPermissionSets.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: '/api/settings/permission-sets'
      })
    )
  );
}

export const getPermissionSetAsResultObservable = memoize(getPermissionSetInternal, id => id, 60000);
function getPermissionSetInternal(id) {
  return refreshSignalPermissionSets.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/permission-sets/${encodeURIComponent(id)}`
      })
    )
  );
}

// regular calls

export function getPermissionSets() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/permission-sets'
  }).map(response => response.body);
}

export function getPermissionSet(permissionSetId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/permission-sets/${encodeURIComponent(permissionSetId)}`
  }).map(response => fromJS(response.body));
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
  return getK8sNamespacesBunch(1, 200);
}

function getK8sNamespacesBunch(page, pageSize) {
  return (
    http({
      method: 'POST',
      maxRetries: 3,
      headers: getCsrfHeader(),
      url: '/api/kubernetes/namespaces',
      data: {
        filter: { timeConfig: {} },
        pagination: { page, pageSize },
        order: { by: 'name', direction: 'ASC' }
      }
    })
      .map(response => response.body.items)
      // the API is restricted to return 200 items max. There are sometimes more than 200 namespaces available.
      // the handling component does not support a load more mechanism and refactoring to a server side table is yet
      // too expensive. As a fix, we load all the namespaces from the API by sending one query after the other with
      // an increasing page size until we retrieved less than 200 items.
      .flatMap(items =>
        items.length === pageSize
          ? getK8sNamespacesBunch(page + 1, pageSize).map(_moreItems => [...items, ..._moreItems])
          : just(items)
      )
  );
}

function defaultQuery() {
  return {
    filter: { timeConfig: {} },
    pagination: { page: 1, pageSize: 200 },
    order: { by: 'name', direction: 'ASC' }
  };
}

export function savePermissionSet(permissionSet) {
  let permissionSetId = permissionSet.id;
  return http({
    method: permissionSetId ? 'PUT' : 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: permissionSetId
      ? `/api/settings/permission-sets/${encodeURIComponent(permissionSetId)}`
      : '/api/settings/permission-sets',
    data: permissionSet
  }).map(mapAndRefresh);
}

function mapAndRefresh(response) {
  refresh();
  return response.body;
}

export function createPermissionSet() {
  return {
    id: null,
    name: 'system_permission_set',
    permissions: [CAN_VIEW_LOGS, CAN_VIEW_TRACE_DETAILS],
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    websiteIds: [],
    mobileAppIds: [],
    infraDfqFilter: ''
  };
}
