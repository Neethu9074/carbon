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

export const getConfigAsResultObservable = memoize(getConfigAsResultObservableInternal, () => '', 60000);
function getConfigAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/authentication/oidc`
      })
    )
  );
}

export function setConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/settings/authentication/oidc`,
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
    url: `/api/settings/authentication/oidc`,
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
    url: '/api/settings/authentication/oidc/available'
  }).map(res => res.body);
}
