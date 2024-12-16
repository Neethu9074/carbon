/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function get() {
  return http({
    method: 'GET',
    url: `/api/settings/logging-integration`,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body.map(integration => integration));
}

export function save(configuration) {
  return http({
    method: 'PUT',
    url: `/api/settings/logging-integration/${encodeURIComponent(configuration.type)}`,
    data: configuration,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
