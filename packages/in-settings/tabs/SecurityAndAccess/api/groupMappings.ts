/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { GroupMappingOverview, Result } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { Response } from 'in-services/http/types';
import { minutes } from 'in-services/time/time';
import http from 'in-services/http';

const basePath = '/api/settings/rbac/mappings';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export interface IdpGroupMapping {
  id: string | null;
  key: string;
  value: string;
  groupId: string;
  teamId?: string | null;
}

export interface IdentityProviderPatch {
  restrictEmptyIdpGroups: boolean;
}

export function getMappings(): Observable<Result<IdpGroupMapping[]>> {
  return refreshSignal.flatMap(
    (): Observable<Result<IdpGroupMapping[]>> =>
      createObservable(
        http({
          method: 'GET',
          maxRetries: 3,
          url: basePath
        })
      )
  );
}

export function setMappings(mappings: IdpGroupMapping[]) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: basePath,
    headers: getCsrfHeader(),
    data: mappings
  });
}

function getMappingsOverviewInternal(): Observable<Result<GroupMappingOverview[]>> {
  return refreshSignal.flatMap(() =>
    http<GroupMappingOverview[]>({
      method: 'GET',
      maxRetries: 3,
      url: `${basePath}/overview`,
      mapToResultObject: true,
      treat400AsError: true
    })
  );
}

// Cache role mappings for 1 minute
export const getMappingsOverview = memoize(getMappingsOverviewInternal, () => 'RoleMappings', minutes.toMillis(1));

export function getIdpRestriction(): Observable<Result<IdentityProviderPatch>> {
  return refreshSignal.flatMap(
    (): Observable<Result<IdentityProviderPatch>> =>
      createObservable(
        http({
          method: 'GET',
          maxRetries: 3,
          url: basePath + '/identityProvider/restrictEmptyIdpGroups'
        })
      )
  );
}

export function setIdpRestriction(value: IdentityProviderPatch) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: basePath + '/identityProvider/restrictEmptyIdpGroups',
    headers: getCsrfHeader(),
    data: value
  });
}

export function deleteMapping(id: string): Observable<Response<void>> {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    url: `${basePath}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(v => {
    refreshSignal.emit(id);
    return v;
  });
}

export function deleteMappings(ids: string[]): Observable<Response<void>> {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/delete`,
    data: ids,
    treat400AsError: true
  }).map(v => {
    refreshSignal.emit(ids);
    return v;
  });
}

export function saveMapping(mapping: IdpGroupMapping): Observable<Result<IdpGroupMapping>> {
  const method = mapping?.id ? 'PUT' : 'POST';
  const url = mapping?.id ? `${basePath}/${encodeURIComponent(mapping.id)}` : basePath;
  return http<IdpGroupMapping>({
    method: method,
    url: url,
    headers: getCsrfHeader(),
    data: mapping,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getMappingRuleById(mappingId: string): Observable<Result<IdpGroupMapping>> {
  return http<IdpGroupMapping>({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${mappingId}`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}
