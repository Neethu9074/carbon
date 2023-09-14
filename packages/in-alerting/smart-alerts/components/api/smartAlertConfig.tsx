/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function deleteAlertConfig(id: string, baseUrl: string): Observable<void> {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  }).map(response => response.body);
}

export function enableAlertConfig(id: string, baseUrl: string): Observable<void> {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/enable`
  }).map(response => response.body);
}

export function disableAlertConfig(id: string, baseUrl: string): Observable<void> {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/disable`
  }).map(response => response.body);
}
