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

export const getConfigAsResultObservable = memoize(getConfigAsResultObservableInternal, () => '', 60000);
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
  }).map(v => {
    refreshSignal.emit(config);
    return v;
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

export function isAvailable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/ldap/available'
  }).map(res => res.body);
}
