/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function changePassword(config) {
  return http({
    method: 'POST',
    url: `/api/settings/authentication/changePassword`,
    headers: getCsrfHeader(),
    data: config
  });
}

function isAvailableQuery() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/authentication/password/available'
  });
}

export function isAvailable() {
  return isAvailableQuery().map(res => res.body);
}
