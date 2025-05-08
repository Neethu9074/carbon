/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, RoleOverview, ApiRole, CreateRole } from '@instana/types';
import { create, Observable } from '@instana/observables';

import {
  ApiRoleWithPermissions,
  RoleDetailsWithPermissions
} from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { translateRoleResult, translateRolesResult } from 'in-settings/utils/i18n';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http/http';

const API_BASE_PATH_ROLES = '/api/settings/rbac/roles';

export const roleDetailsRefreshSignal = create<number>().emit(Date.now());

export function refreshRole() {
  roleDetailsRefreshSignal.emit(Date.now());
}

function refreshOnSuccess<T>(result: Result<T>): Result<T> {
  if (!result.progress.loading && !result.errors.length) refreshRole();
  return result;
}

interface GetRoleInternalProps {
  id: string;
}

function getRoleInternal({ id }: GetRoleInternalProps): Observable<Result<ApiRoleWithPermissions>> {
  return roleDetailsRefreshSignal.flatMap(() =>
    http<ApiRoleWithPermissions>({
      mapToResultObject: true,
      maxRetries: 3,
      method: 'GET',
      url: `${API_BASE_PATH_ROLES}/${encodeURI(id)}`,
      treat400AsError: true
    }).map(translateRoleResult)
  );
}

export const getRole = memoize<GetRoleInternalProps, Result<ApiRoleWithPermissions>>(
  getRoleInternal,
  ({ id }) => `${roleDetailsRefreshSignal._lastEmittedValue}-${id}`,
  minutes.toMillis(1)
);

function getRoleDetailsInternal({ id }: GetRoleInternalProps): Observable<Result<RoleDetailsWithPermissions>> {
  return roleDetailsRefreshSignal.flatMap(() =>
    http<RoleDetailsWithPermissions>({
      queryParams: { includeTeamUsage: true },
      mapToResultObject: true,
      maxRetries: 3,
      method: 'GET',
      url: `${API_BASE_PATH_ROLES}/${encodeURI(id)}`,
      treat400AsError: true
    }).map(translateRoleResult)
  );
}

export const getRoleDetails = memoize<GetRoleInternalProps, Result<RoleDetailsWithPermissions>>(
  getRoleDetailsInternal,
  ({ id }) => `${roleDetailsRefreshSignal._lastEmittedValue}-${id}`,
  minutes.toMillis(1)
);

function getRolesOverviewInternal(): Observable<Result<RoleOverview[]>> {
  return roleDetailsRefreshSignal.flatMap(() =>
    http<RoleOverview[]>({
      mapToResultObject: true,
      maxRetries: 3,
      method: 'GET',
      url: `${API_BASE_PATH_ROLES}/overview`
    }).map(translateRolesResult)
  );
}

export const getRolesOverview = memoize<void, Result<RoleOverview[]>>(
  getRolesOverviewInternal,
  () => 'Roles',
  minutes.toMillis(1)
);

export function createRole(role: CreateRole): Observable<Result<ApiRole>> {
  return http<ApiRole>({
    data: role,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    maxRetries: 3,
    method: 'POST',
    treat400AsError: true,
    url: API_BASE_PATH_ROLES
  }).map(refreshOnSuccess);
}

export function updateRole(role: ApiRole): Observable<Result<ApiRole>> {
  return http<ApiRole>({
    data: role,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    maxRetries: 3,
    method: 'PUT',
    treat400AsError: true,
    url: `${API_BASE_PATH_ROLES}/${role.id}`
  }).map(refreshOnSuccess);
}

interface DeleteRoleProps {
  id: string;
}

export function deleteRole({ id }: DeleteRoleProps): Observable<Result<unknown>> {
  return http({
    headers: getCsrfHeader(),
    mapToResultObject: true,
    maxRetries: 3,
    method: 'DELETE',
    treat400AsError: true,
    url: `${API_BASE_PATH_ROLES}/${id}`
  }).map(refreshOnSuccess);
}

interface AddRoleMembersProps {
  roleId: string;
  userIds: string[];
}

export function addRoleMembers({ roleId, userIds }: AddRoleMembersProps): Observable<Result<ApiRole>> {
  return (
    http<ApiRole>({
      headers: getCsrfHeader(),
      mapToResultObject: true,
      maxRetries: 3,
      method: 'PUT',
      treat400AsError: true,
      url: `${API_BASE_PATH_ROLES}/${roleId}/users`,
      data: userIds
    })
      /**
       * There seems to be a small delay until all data has been correctly
       * updated and replicated, which is why we wait 500ms before we send a
       * refresh signal.
       **/
      .debounce(500)
      .map(refreshOnSuccess)
  );
}

interface RemoveMemberFromRoleProps {
  roleId: string;
  userId: string;
}

export function removeMemberFromRole({ roleId, userId }: RemoveMemberFromRoleProps): Observable<Result<ApiRole>> {
  return (
    http<ApiRole>({
      headers: getCsrfHeader(),
      mapToResultObject: true,
      maxRetries: 3,
      method: 'DELETE',
      treat400AsError: true,
      url: `${API_BASE_PATH_ROLES}/${roleId}/user/${userId}`
    })
      /**
       * There seems to be a small delay until all data has been correctly
       * updated and replicated, which is why we wait 500ms before we send a
       * refresh signal.
       **/
      .debounce(500)
      .map(refreshOnSuccess)
  );
}
