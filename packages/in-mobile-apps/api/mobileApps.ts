/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { compareIgnoreCase } from 'in-services/util/string';
import { MobileAppConfiguration, Result } from 'in-types';
import http from 'in-services/http';

export function getMobileApps(): Observable<MobileAppConfiguration[]> {
  return http<MobileAppConfiguration[]>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config`
  }).map(response => {
    const keys = response.body || [];
    keys.sort((a, b) => compareIgnoreCase(a.name, b.name));
    return keys;
  });
}

export function removeMobileApp(id: string): Observable<unknown> {
  return http<unknown>({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addMobileApp(name: string): Observable<MobileAppConfiguration> {
  return http<MobileAppConfiguration>({
    method: 'POST',
    url: `/api/mobile-app-monitoring/config`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response.body);
}

export function renameMobileApp(id: string, name: string): Observable<MobileAppConfiguration> {
  return http<MobileAppConfiguration>({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/mobile-app-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response.body);
}

export function getMobileAppConfigurations(): Observable<Result<MobileAppConfiguration[]>> {
  return http<MobileAppConfiguration[]>({
    method: 'GET',
    maxRetries: 3,
    mapToResultObject: true,
    url: `/api/mobile-app-monitoring/config`
  });
}
