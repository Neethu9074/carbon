/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getApiTokens(): Observable<any> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens`
  }).map(response => response.body);
}

export function getApiToken(id: string): Observable<any> {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
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
  }).map(response => response.body);
}

export function saveApiToken(apiToken: any): Observable<any> {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(apiToken.internalId)}`,
    data: apiToken
  }).map(response => response.body);
}

export function deleteApiToken(id: string): Observable<any> {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/api-tokens/${encodeURIComponent(id)}`
  });
}
