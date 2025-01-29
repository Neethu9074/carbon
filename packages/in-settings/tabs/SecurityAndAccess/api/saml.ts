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

export const getConfigAsResultObservable = memoize(getConfigAsResultObservableInternal, () => 'SamlConfig', 60000);
function getConfigAsResultObservableInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/authentication/saml`
      })
    )
  );
}

// regular calls

export function setConfig(config) {
  return http({
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

export function deleteConfig() {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/settings/authentication/saml`,
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
    url: '/api/settings/authentication/saml/available'
  });
}

export function isAvailable() {
  return isAvailableQuery().map(res => res.body);
}

export function isSamlActive() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/saml/active'
  }).map(res => res.body);
}
