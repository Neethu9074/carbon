/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LdapConfig, LdapTestResult, Result } from '@instana/types';
import { create, Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
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

export function getTestResult(config: LdapConfig): Observable<Result<LdapTestResult>> {
  return http<LdapTestResult>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap/test`,
    headers: getCsrfHeader(),
    data: config,
    mapToResultObject: true
  });
}

export function setConfig(config: LdapConfig): Observable<Result<undefined>> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader(),
    data: config,
    mapToResultObject: true
  });
}

export function deleteConfig(): Observable<Result<boolean>> {
  return http<boolean>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
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
