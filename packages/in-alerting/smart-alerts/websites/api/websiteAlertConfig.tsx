/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { WebsiteAlertConfigWithMetadata, ConfigVersion, Result, WebsiteAlertConfig } from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const baseUrl = 'api/events/settings/website-alert-configs';

export function createAlertConfig(data: WebsiteAlertConfig): Observable<WebsiteAlertConfigWithMetadata> {
  return http<WebsiteAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(data: WebsiteAlertConfig, id: string): Observable<WebsiteAlertConfigWithMetadata> {
  return http<WebsiteAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}

export function getAllAlertConfigs(
  websiteId: string,
  config: { asObservable: boolean }
): Observable<Result<WebsiteAlertConfigWithMetadata[]>>;
export function getAllAlertConfigs(
  websiteId?: string,
  config?: { asObservable: boolean }
): Observable<WebsiteAlertConfigWithMetadata[]>;
export function getAllAlertConfigs(
  websiteId?: string,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<WebsiteAlertConfigWithMetadata[]>> | Observable<WebsiteAlertConfigWithMetadata[]> {
  const request = http<WebsiteAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      websiteId
    },
    url: baseUrl
  });
  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getAllVersionsOfAlertConfig(
  id: string,
  config: { asObservable: boolean }
): Observable<Result<ConfigVersion[]>>;
export function getAllVersionsOfAlertConfig(id: string, config?: { asObservable: false }): Observable<ConfigVersion[]>;
export function getAllVersionsOfAlertConfig(
  id: string,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<ConfigVersion[]>> | Observable<ConfigVersion[]> {
  const request = http<ConfigVersion[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/versions`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getLatestAlertConfig(
  id: string,
  config: { asObservable: boolean }
): Observable<Result<WebsiteAlertConfigWithMetadata>>;
export function getLatestAlertConfig(
  id: string,
  config?: { asObservable: boolean }
): Observable<WebsiteAlertConfigWithMetadata>;
export function getLatestAlertConfig(
  id: string,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<WebsiteAlertConfigWithMetadata>> | Observable<WebsiteAlertConfigWithMetadata> {
  const request = http<WebsiteAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: boolean }
): Observable<Result<WebsiteAlertConfigWithMetadata>>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: boolean }
): Observable<WebsiteAlertConfigWithMetadata>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<WebsiteAlertConfigWithMetadata>> | Observable<WebsiteAlertConfigWithMetadata> {
  const request = http<WebsiteAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function enableAlertConfig(id: string): Observable<void> {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/enable`
  }).map(response => response.body);
}

export function disableAlertConfig(id: string): Observable<void> {
  return http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/disable`
  }).map(response => response.body);
}

export function deleteAlertConfig(id: string): Observable<void> {
  return http<void>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  }).map(response => response.body);
}

export function restoreAlertConfigVersion(id: string, created: number): Observable<WebsiteAlertConfigWithMetadata> {
  return http<WebsiteAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
