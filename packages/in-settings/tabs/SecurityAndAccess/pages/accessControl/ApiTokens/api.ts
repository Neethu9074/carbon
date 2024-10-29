/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { create, Observable } from '@instana/observables';

import { ApiTokenProps } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiToken';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const refreshSignal = create().emit(true);
export function refresh() {
  refreshSignal.emit(true);
}

function getApiTokensInternal() {
  return refreshSignal.flatMap(() =>
    createObservable(
      http<ApiTokenProps[]>({
        method: 'GET',
        maxRetries: 3,
        url: `/api/settings/api-tokens`
      })
    )
  );
}

// follow the patterns of caching in other areas. Here, without a parameter for any id
// be careful: only deletes itself and cached value
// after all observers had been disposed!
// always returns a cached observable
export const getApiTokens = memoize(getApiTokensInternal, () => 'ApiTokens', minutes.toMillis(1));

export function getApiToken(id: string): Observable<any> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function getTokenIdByAccessGrantingToken(token: string): Observable<any> {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 0,
    url: `/api/settings/api-tokens/getTokenIdByAccessGrantingToken`,
    treat400AsError: false,
    data: { query: token }
  }).map(response => response.body);
}

export function unmaskApiToken(id: string): Observable<any> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens/unmask/${encodeURIComponent(id)}`
  }).map(response => response);
}

export function createApiToken(apiToken: any): Observable<any> {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 0,
    url: `/api/settings/api-tokens`,
    data: apiToken
  }).map(response => {
    refresh();
    return response.body;
  });
}

export function saveApiToken(apiToken: any): Observable<any> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(apiToken.internalId)}`,
    data: apiToken
  }).map(response => {
    refresh();
    return response.body;
  });
}

export function deleteApiToken(id: string): Observable<any> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  }).map(response => {
    refresh();
    return response;
  });
}
