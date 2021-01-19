/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function saveUserSettings(data) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/user-settings',
    data
  }).map(response => response.body);
}
