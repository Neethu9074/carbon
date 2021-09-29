/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { create, Observable } from '@instana/observables';

import memoize, { ObservableCreator } from 'in-services/util/memoizingObservableGenerator';
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

export const getMappings: ObservableCreator<void, Result<IdpGroupMapping[]>> = memoize(
  getMappingsInternal,
  () => '',
  60000
);
function getMappingsInternal(): Observable<Result<IdpGroupMapping[]>> {
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

export const getIdp: ObservableCreator<void, Result<IdentityProviderPatch>> = memoize(getIdpInternal, () => '', 60000);
function getIdpInternal(): Observable<Result<IdentityProviderPatch>> {
  return refreshSignal.flatMap(
    (): Observable<Result<IdentityProviderPatch>> =>
      createObservable(
        http({
          method: 'GET',
          maxRetries: 3,
          url: basePath + '/identityProvider'
        })
      )
  );
}

export function setIdp(value: IdentityProviderPatch) {
  return http({
    method: 'PATCH',
    maxRetries: 3,
    url: basePath + '/identityProvider',
    headers: getCsrfHeader(),
    data: value
  });
}
