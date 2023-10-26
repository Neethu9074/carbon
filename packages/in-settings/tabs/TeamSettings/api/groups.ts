/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable, create } from '@instana/observables';
import { ApiGroup, Result } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';

const basePath = '/api/settings/rbac/groups';

const refreshSignalTeams = create().emit(true);
export function refresh() {
  refreshSignalTeams.emit(true);
}

// observables
export const getGroupWithIdpFlagAsResultObservable = memoize(
  getGroupWithIdpFlagAsResultObservableInternal,
  groupId => groupId,
  60000
);

function getGroupWithIdpFlagAsResultObservableInternal(groupId: string) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<{ groupWithRoles: ApiGroup; idpFlagMap: Object }>({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/${groupId}/group-with-idp-mapping`
      }).map(r => {
        const groupWithRoles = r.body.groupWithRoles;
        const idpFlagMap = new Map(Object.entries(r.body.idpFlagMap));
        return {
          ...r,
          body: {
            ...groupWithRoles,
            members: groupWithRoles.members.map(member => ({
              ...member,
              joinedViaIdpMapping: idpFlagMap.get(member.userId)
            }))
          }
        };
      })
    )
  );
}

export const getGroupsAsResultObservable = () =>
  memoize<undefined, Result<ApiGroup[]>>(getGroupsAsResultObservableInternal, () => '', 60000)(undefined);
function getGroupsAsResultObservableInternal(_arg: undefined) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<ApiGroup[]>({
        method: 'GET',
        maxRetries: 3,
        url: basePath
      })
    )
  );
}

export const getGroupAsResultObservable = memoize(getGroupAsResultObservableInternal, groupId => groupId, 60000);
function getGroupAsResultObservableInternal(groupId: string) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/${groupId}`
      })
    )
  );
}

export const getGroupsOfASingleUser = memoize(getGroupsOfASingleUserInternal, email => email, 60000);
function getGroupsOfASingleUserInternal(email: string) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/user/${email}`
      })
    )
  );
}

export const getStrippedGroupsWithIdpFlagAsResultObservable = (userId: string) =>
  memoize(
    () => getStrippedGroupsWithIdpFlagAsResultObservableInternal(userId),
    () => '',
    60000
  );
function getStrippedGroupsWithIdpFlagAsResultObservableInternal(userId: string) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/user/${userId}/idp-mapping`
      })
    )
  );
}

export const getStrippedGroupsAsResultObservable = () =>
  memoize<undefined, Result<ApiGroup[]>>(getStrippedGroupsAsResultObservableInternal, () => '', 60000)(undefined);
function getStrippedGroupsAsResultObservableInternal(_arg: undefined) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<ApiGroup[]>({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/stripped`
      })
    )
  );
}

// regular calls

export function saveGroup(group: ApiGroup) {
  return http({
    method: group.id ? 'PUT' : 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: group.id ? `${basePath}/${group.id}` : basePath,
    data: group
  }).map(mapAndRefresh);
}

export function saveGroups(groups: ApiGroup[]) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: basePath,
    data: groups
  }).map(mapAndRefresh);
}

export function deleteGroup(id: string) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${id}`
  }).map(mapAndRefresh);
}

/**
 * Removes the given user from the given group without doing any mapping or page reloads
 * @param {string} groupId to be removed from
 * @param {string} userId to be removed
 * @returns Observable<Response<String>>
 */
export function removeUserFromGroupWithoutMapAndRefresh(groupId: string, userId: string): Observable<Response<string>> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/rbac/groups/${groupId}/user/${userId}`
  });
}

/**
 * Removes the given user from the given group with mapAndRefresh
 *
 * @param {string} groupId to be removed from
 * @param {string} userId to be removed
 * @returns Observable<Response<String>>
 */
export function removeUserFromGroup(groupId: string, userId: string) {
  return removeUserFromGroupWithoutMapAndRefresh(groupId, userId).map(mapAndRefresh);
}

/**
 * Allows to set the given userIds as users to the current group
 * @param {string} groupId id of group
 * @param {string[]} userIds list of userIds to be set as users to group
 * @returns {import('@instana/observables').Observable} of complete group
 */
export function setUsersToGroup(groupId: string, userIds: string[]) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${groupId}/users`,
    data: userIds
  });
}

function mapAndRefresh<T>(response: Response<T>): T {
  refresh();
  return response.body;
}

export function createNewGroup(): ApiGroup {
  return {
    id: '',
    name: '',
    members: [],
    permissionSet: createPermissionSet()
  };
}

function createPermissionSet() {
  return {
    id: null,
    name: 'system_permission_set',
    permissions: ['CAN_VIEW_TRACE_DETAILS', 'CAN_VIEW_LOGS'],
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    websiteIds: [],
    mobileAppIds: [],
    infraDfqFilter: { scopeId: '', scopeRoleId: '-1' },
    syntheticTestIds: []
  };
}
