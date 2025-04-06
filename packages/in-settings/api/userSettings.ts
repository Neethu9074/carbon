/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';
import { Result } from '@instana/types';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function saveUserSettings(data?: any) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/user-settings',
    data
  }).map(response => response.body);
}

export function saveUserSettingsAsObservable(data?: any): Observable<Result<void>> {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/user-settings',
    data,
    treat400AsError: true,
    mapToResultObject: true
  });
}
