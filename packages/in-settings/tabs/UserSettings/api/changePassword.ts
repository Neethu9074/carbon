/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

/*
  private final String password;
  @NotBlank
  @Length(min = 3, max = 128)
  private final String newPassword;
  @NotBlank
  @Length(min = 3, max = 128)
  private final String repeatedPassword;
*/

export interface ChangePasswordRequest {
  readonly password: string;
  readonly newPassword: string;
  readonly repeatedPassword: string;
}

// TODO sends a redirect
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
