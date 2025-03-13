/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { OidcApiRequestConfig, OidcApiResponseConfig, Result } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import http, { Response } from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

export const getConfigAsResultObservable = memoize(getConfigAsResultObservableInternal, () => 'OidcConfig', 60000);
export function getConfigAsResultObservableInternal(): Observable<Result<OidcApiResponseConfig>> {
  return refreshSignal.flatMap(() =>
    http({
      method: 'GET',
      maxRetries: 3,
      url: `/api/settings/authentication/oidc`,
      mapToResultObject: true
    })
  );
}

export function setConfig(config: OidcApiRequestConfig): Observable<Result<OidcApiResponseConfig>> {
  return http<OidcApiResponseConfig>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/oidc`,
    headers: getCsrfHeader(),
    data: config,
    mapToResultObject: true
  }).map(v => {
    if (!idpConfigV2Enabled) refreshSignal.emit(config);
    return v;
  });
}

export function deleteConfig(): Observable<Result<boolean>> {
  return http<boolean>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/oidc`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(response => {
    if (!idpConfigV2Enabled) refreshSignal.emit(true);
    return response;
  });
}

function isAvailableQuery(): Observable<Response<boolean>> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/oidc/available'
  });
}

export function isAvailable(): Observable<boolean> {
  return isAvailableQuery().map(res => res.body);
}

export function isOidcActive(): Observable<boolean> {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/oidc/active'
  }).map(res => res.body);
}
