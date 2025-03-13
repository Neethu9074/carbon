/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, SamlApiConfig, SamlConfig } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import http, { Response } from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export const getConfigAsResultObservable = memoize<undefined, Result<SamlConfig>>(
  getConfigAsResultObservableInternal,
  () => 'SamlConfig',
  60000
);
export function getConfigAsResultObservableInternal(): Observable<Result<SamlConfig>> {
  return refreshSignal.flatMap(() =>
    http({
      method: 'GET',
      maxRetries: 3,
      url: '/api/settings/authentication/saml',
      mapToResultObject: true
    })
  );
}

// regular calls

export function setConfig(config: SamlApiConfig): Observable<Result<SamlConfig>> {
  return http<SamlConfig>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/saml`,
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
    url: `/api/settings/authentication/saml`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(response => {
    if (!idpConfigV2Enabled) refreshSignal.emit(true);
    return response;
  });
}

function isAvailableQuery(): Observable<Response<boolean>> {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/saml/available'
  });
}

export function isAvailable(): Observable<boolean> {
  return isAvailableQuery().map(res => res.body);
}

export function isSamlActive(): Observable<boolean> {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/saml/active'
  }).map(res => res.body);
}
