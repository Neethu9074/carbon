/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

// observables

export const getConfigAsResultObservableNotMemoized = getConfigAsResultObservableInternal;
export const getConfigAsResultObservable = memoize(getConfigAsResultObservableInternal, () => 'LdapConfig', 60000);
function getConfigAsResultObservableInternal() {
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

export function getTestResult(config) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap/test`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function setConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader(),
    data: config
  });
}

export function deleteConfig() {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/ldap`,
    headers: getCsrfHeader()
  }).map(response => {
    refreshSignal.emit(true);
    return response.body;
  });
}

function isAvailableQuery() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/ldap/available'
  });
}

export function isAvailable() {
  return isAvailableQuery().map(res => res.body);
}

export function isLdapActive() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/ldap/active'
  }).map(res => res.body);
}
