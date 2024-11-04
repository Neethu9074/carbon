/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';
import { Result } from 'in-types';

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
