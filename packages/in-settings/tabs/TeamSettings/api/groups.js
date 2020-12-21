import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { createPermissionSet } from 'in-api/permissionSets';
import http from 'in-services/http';

const refreshSignalTeams = create().emit(true);
function refresh() {
  refreshSignalTeams.emit(true);
}

// observables

export const getGroupsAsResultObservable = memoize(getGroupsAsResultObservableInternal, () => '', 60000);
function getGroupsAsResultObservableInternal() {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/groups`
      })
    )
  );
}

export const getGroupAsResultObservable = memoize(getGroupAsResultObservableInternal, groupId => groupId, 60000);
function getGroupAsResultObservableInternal(groupId) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/group/${groupId}`
      })
    )
  );
}

// regular calls

export function saveGroup(group) {
  return http({
    method: group.id ? 'PUT' : 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: group.id ? `/api/settings/group/${group.id}` : '/api/settings/group',
    data: group
  }).map(mapAndRefresh);
}

export function saveGroups(groups) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/settings/groups',
    data: groups
  }).map(mapAndRefresh);
}

export function deleteGroup(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/group/${id}`
  }).map(mapAndRefresh);
}

function mapAndRefresh(response) {
  refresh();
  return response.body;
}

export function createNewGroup() {
  return {
    id: null,
    name: 'New Group',
    members: [],
    permissionSet: createPermissionSet()
  };
}
