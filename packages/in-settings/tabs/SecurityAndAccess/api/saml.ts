/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, SamlApiConfig, SamlConfig } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
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
export function setConfig(config: SamlApiConfig): Observable<Response<SamlConfig>> {
  return http<SamlConfig>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/saml`,
    headers: getCsrfHeader(),
    data: config
  }).map(v => {
    refreshSignal.emit(config);
    return v;
  });
}

export function deleteConfig(): Observable<boolean> {
  return http<boolean>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/saml`,
    headers: getCsrfHeader()
  }).map(response => {
    refreshSignal.emit(true);
    return response.body;
  });
}

export function setConfigV2(config: SamlApiConfig): Observable<Result<SamlConfig>> {
  return http<SamlConfig>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/saml`,
    headers: getCsrfHeader(),
    data: config,
    mapToResultObject: true
  });
}

export function deleteConfigV2(): Observable<Result<boolean>> {
  return http<boolean>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/saml`,
    headers: getCsrfHeader(),
    mapToResultObject: true
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
