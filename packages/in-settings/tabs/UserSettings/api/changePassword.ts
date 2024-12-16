/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

export interface ChangePasswordRequest {
  readonly password: string;
  readonly newPassword: string;
  readonly repeatedPassword: string;
}

export function changePassword(data: ChangePasswordRequest) {
  return http({
    method: 'POST',
    url: `/api/settings/authentication/changePassword`,
    headers: getCsrfHeader(),
    data
  });
}

export function isAvailable() {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/password/available'
  }).map(res => res.body);
}

// follow the patterns of caching in other areas. Here, without a parameter for any id
// be careful: only deletes itself and cached value
// after all observers had been disposed!
const memoizedIsAvailable = memoize(isAvailable, () => 'PasswordAuthenticationAvailable', minutes.toMillis(1));

// always returns a cached observable
export const isAvailableCached = () => memoizedIsAvailable(0 /*unused*/);
