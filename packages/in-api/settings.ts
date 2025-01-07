/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { UiSettings } from 'in-types';
import http from 'in-services/http';

export function saveSettings(settings: UiSettings) {
  return http<UiSettings>({
    method: 'PUT',
    url: `/api/ui/settings`,
    data: settings,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function saveSetting<T>(key: string, value: T) {
  return http<T>({
    method: 'PUT',
    url: `/api/ui/settings/${encodeURIComponent(key)}`,
    data: value,
    maxRetries: 3,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
