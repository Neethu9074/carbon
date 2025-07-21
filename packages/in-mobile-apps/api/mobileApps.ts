/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MobileAppConfiguration, Result, SourceMapUploadConfig, SourceMapUploadConfigs } from '@instana/types';
import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { compareIgnoreCase } from 'in-services/util/string';
import http from 'in-services/http';

const configUrl = `/api/mobile-app-monitoring/config`;

export function getMobileApps(): Observable<MobileAppConfiguration[]> {
  return http<MobileAppConfiguration[]>({
    method: 'GET',
    maxRetries: 3,
    url: configUrl
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
    url: `${configUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addMobileApp(name: string): Observable<MobileAppConfiguration> {
  return http<MobileAppConfiguration>({
    method: 'POST',
    url: configUrl,
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
    url: `${configUrl}/${encodeURIComponent(id)}`,
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
    url: configUrl
  });
}

export function addSourceMapUploadConfiguration(
  mobileAppId: string,
  config: SourceMapUploadConfig
): Observable<SourceMapUploadConfig> {
  return http<SourceMapUploadConfig>({
    method: 'POST',
    url: `${configUrl}/${encodeURIComponent(mobileAppId)}/sourcemap-upload`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function updateSourceMapUploadConfiguration(
  mobileAppId: string,
  config: SourceMapUploadConfig
): Observable<SourceMapUploadConfig> {
  return http<SourceMapUploadConfig>({
    method: 'PUT',
    url: `${configUrl}/${encodeURIComponent(mobileAppId)}/sourcemap-upload/${encodeURIComponent(config.id)}`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function getSourceMapUploadConfigurations(id: string): Observable<Array<SourceMapUploadConfig>> {
  return http<SourceMapUploadConfigs>({
    method: 'GET',
    maxRetries: 3,
    url: `${configUrl}/${encodeURIComponent(id)}/sourcemap-upload`,
    headers: getCsrfHeader()
  }).map(response => response.body.configs);
}

export function removeSourceMapUploadConfiguration(mobileAppId: string, sourceMapConfigId: string): Observable<never> {
  return http<never>({
    method: 'DELETE',
    maxRetries: 3,
    url: `${configUrl}/${encodeURIComponent(mobileAppId)}/sourcemap-upload/${encodeURIComponent(sourceMapConfigId)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
