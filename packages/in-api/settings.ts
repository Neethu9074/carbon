/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function saveSettings(settings) {
  return http({
    method: 'PUT',
    url: `/api/ui/settings`,
    data: settings,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function saveSetting(key, value) {
  return http({
    method: 'PUT',
    url: `/api/ui/settings/${encodeURIComponent(key)}`,
    data: value,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
