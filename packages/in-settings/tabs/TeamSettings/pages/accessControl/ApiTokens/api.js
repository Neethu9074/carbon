/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* import { create } from '@instana/observables'; */

/* import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator'; */
import http from 'in-services/http';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';

/* const refreshSignal = create().emit(true);

export const getApiTokensAsResultObservable = memoize(getApiTokensAsResultObservableInternal, () => '', 60000);
function getApiTokensAsResultObservableInternal() {
  return refreshSignal.flatMap(() => createObservable(getApiTokens()));
} */

export function getApiTokens() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens`
  }).map(response => response.body);
}

export function getApiToken(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function unmaskApiToken(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens/unmask/${encodeURIComponent(id)}`
  }).map(response => response);
}

export function createApiToken(apiToken) {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 0,
    url: `/api/settings/api-tokens`,
    data: apiToken
  }).map(response => response.body);
}

export function saveApiToken(apiToken) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(apiToken.internalId)}`,
    data: apiToken
  }).map(response => response.body);
}

export function deleteApiToken(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  });
}
