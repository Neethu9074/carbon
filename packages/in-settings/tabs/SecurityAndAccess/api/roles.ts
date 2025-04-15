/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Result, RoleOverview, ApiRole, CreateRole } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { ApiRoleWithPermissions } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/Roles/Roles.types';
import { translateRoleResult, translateRolesResult } from 'in-settings/utils/i18n';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http/http';

const API_BASE_PATH_ROLES = '/api/settings/rbac/roles';

const refreshSignal = create<string>().emit('');

interface GetRoleInternalProps {
  id: string;
}

function getRoleInternal({ id }: GetRoleInternalProps): Observable<Result<ApiRoleWithPermissions>> {
  return refreshSignal.flatMap(() =>
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
  ({ id }) => id,
  minutes.toMillis(1)
);

function getRolesOverviewInternal(): Observable<Result<RoleOverview[]>> {
  return refreshSignal.flatMap(() =>
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
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res.data.id);

    return res;
  });
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
  }).map(res => {
    if (res?.data?.id) refreshSignal.emit(res.data.id);

    return res;
  });
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
  }).map(res => {
    refreshSignal.emit(id);
    return res;
  });
}
