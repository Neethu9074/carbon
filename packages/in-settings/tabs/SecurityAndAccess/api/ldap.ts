/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LdapConfig, LdapTestResult, Result } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http, { Response } from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export const getConfigAsResultObservableNotMemoized = getConfigAsResultObservableInternal;
export const getConfigAsResultObservable = memoize(getConfigAsResultObservableInternal, () => 'LdapConfig', 60000);
export function getConfigAsResultObservableInternal(): Observable<Result<LdapConfig>> {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/authentication/ldap`
      })
    )
  );
}

// regular calls
export function getTestResult(config: LdapConfig): Observable<LdapTestResult> {
  return http<LdapTestResult>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap/test`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function getTestResultV2(config: LdapConfig): Observable<Result<LdapTestResult>> {
  return http<LdapTestResult>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap/test`,
    headers: getCsrfHeader(),
    data: config,
    mapToResultObject: true
  });
}

export function setConfig(config: LdapConfig): Observable<Response<undefined>> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader(),
    data: config
  });
}

export function deleteConfig(): Observable<boolean> {
  return http<boolean>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader()
  }).map(response => {
    refreshSignal.emit(true);
    return response.body;
  });
}

export function setConfigV2(config: LdapConfig): Observable<Result<undefined>> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader(),
    data: config,
    mapToResultObject: true
  });
}

export function deleteConfigV2(): Observable<Result<boolean>> {
  return http<boolean>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader(),
    mapToResultObject: true
  });
}

function isAvailableQuery(): Observable<Response<boolean>> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/ldap/available'
  });
}

export function isAvailable(): Observable<boolean> {
  return isAvailableQuery().map(res => res.body);
}

export function isLdapActive(): Observable<boolean> {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/ldap/active'
  }).map(res => res.body);
}
