/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
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

function isAvailableQuery() {
  return http<boolean>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/password/available'
  });
}

export function isAvailable() {
  return isAvailableQuery().map(res => res.body);
}
