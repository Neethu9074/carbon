/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ApiGroup, ApplicationNameExists, GroupReference, Result, SearchResult } from '@instana/types';
import { Observable, create } from '@instana/observables';

import {
  translateRolesResponse,
  translateRolesResult,
  translateStaticRoleName,
  translateStaticRolesByNameKey
} from 'in-settings/utils/i18n';
import { syntheticViewCapabilities } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/RolesAndAccessScope/constants';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { Response } from 'in-services/http/types';
import http from 'in-services/http';

const basePath = '/api/settings/rbac/groups';

type ApiCreateGroup = Omit<ApiGroup, 'id'>;
function isApiGroup(group: ApiGroup | ApiCreateGroup): group is ApiGroup {
  return (group as ApiGroup).id !== undefined;
}

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
        const groupWithRoles = translateStaticRoleName({ role: r.body.groupWithRoles, nameKey: 'name' });
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

function getGroupsResultInternal(): Observable<Result<ApiGroup[]>> {
  return http<ApiGroup[]>({
    method: 'GET',
    maxRetries: 3,
    url: basePath,
    mapToResultObject: true,
    treat400AsError: true
  }).map(translateRolesResult);
}

export const getGroups = memoize(
  () => refreshSignalTeams.flatMap(() => getGroupsResultInternal()),
  () => 'groups',
  60000
);

export const getGroupsAsResultObservable = () =>
  memoize<undefined, Result<ApiGroup[]>>(getGroupsAsResultObservableInternal, () => '', 60000)(undefined);
function getGroupsAsResultObservableInternal(_arg: undefined) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<ApiGroup[]>({
        method: 'GET',
        maxRetries: 3,
        url: basePath
      }).map(translateRolesResponse)
    )
  );
}

export const getGroupAsResultObservable = memoize(getGroupAsResultObservableInternal, groupId => groupId, 60000);
function getGroupAsResultObservableInternal(groupId: string): Observable<Result<ApiGroup[]>> {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<ApiGroup[]>({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/${groupId}`
      }).map(translateRolesResponse)
    )
  );
}

export const getGroupsOfASingleUser = memoize(getGroupsOfASingleUserInternal, email => email, 60000);
function getGroupsOfASingleUserInternal(email: string) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<ApiGroup[]>({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/user/${email}`
      }).map(translateRolesResponse)
    )
  );
}

interface IdpGroup {
  groupId: string;
  groupName: string;
  groupSize: number;
  joinedViaIdpMapping?: boolean;
  limited?: boolean;
}

export const getStrippedGroupsWithIdpFlagAsResultObservable = (userId: string) =>
  memoize(
    () => getStrippedGroupsWithIdpFlagAsResultObservableInternal(userId),
    () => 'StrippedGroupsWithIdpFlag',
    60000
  );
function getStrippedGroupsWithIdpFlagAsResultObservableInternal(userId: string) {
  return refreshSignalTeams.flatMap(() =>
    createObservable(
      http<IdpGroup[]>({
        method: 'GET',
        maxRetries: 3,
        url: `${basePath}/user/${userId}/idp-mapping`
      }).map(response => {
        if (!response.body) return response;

        return {
          ...response,
          body: translateStaticRolesByNameKey({
            roles: response.body,
            nameKey: 'groupName'
          })
        };
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
      }).map(translateRolesResponse)
    )
  );
}

// regular calls

export function saveGroup(group: ApiGroup | ApiCreateGroup) {
  if (isApiGroup(group)) {
    return http<ApiGroup>({
      method: 'PUT',
      maxRetries: 3,
      headers: getCsrfHeader(),
      url: `${basePath}/${group.id}`,
      data: group
    }).map(mapAndRefresh);
  }
  return http<ApiGroup>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: basePath,
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

export function deleteGroups(ids: string[]) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/delete`,
    data: ids,
    treat400AsError: true
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

export function createNewGroup(): ApiCreateGroup {
  return {
    name: '',
    members: [],
    permissionSet: createPermissionSet()
  };
}

function createPermissionSet() {
  return {
    id: null,
    name: 'system_permission_set',
    permissions: ['CAN_VIEW_TRACE_DETAILS', 'CAN_VIEW_LOGS', ...syntheticViewCapabilities],
    applicationIds: [],
    kubernetesClusterUUIDs: [],
    kubernetesNamespaceUIDs: [],
    websiteIds: [],
    mobileAppIds: [],
    syntheticCredentialKeys: [],
    syntheticTestIds: [],
    businessPerspectiveIds: [],
    infraDfqFilter: { scopeId: '', scopeRoleId: '-1' },
    actionFilter: { scopeId: undefined, scopeRoleId: '-1' }
  };
}

export function contributionFilterNameExists(name: string): Observable<Result<ApplicationNameExists>> {
  return createObservable(
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/application-monitoring/settings/application/names/exists?name=${name}`
    })
  );
}

/**
 * Find the group id and name for a restricting application with access group configuration permission
 * @param {string} restrictingApplicationId application id of a parent restricting application
 * @returns Observable<Response<GroupInfoByRestrictingApplicationId>>
 */
export function getGroupInfoByRestrictingApplicationId(
  restrictingApplicationId: string
): Observable<SearchResult<GroupReference>> {
  return http<SearchResult<GroupReference>>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/rbac/groups/search?restrictingApplicationId=${restrictingApplicationId}`
  }).map(response => response.body);
}
