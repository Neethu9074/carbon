/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import {
  deleteAlertConfig as deleteAlertConfigApi,
  disableAlertConfig as disableAlertConfigApi,
  enableAlertConfig as enableAlertConfigApi
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
import {
  WebsiteSmartAlertConfig,
  WebsiteSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { ConfigVersion, Result } from 'in-types';
import http from 'in-services/http';

const baseUrl = apiEndpoint.WEBSITE;

export function createAlertConfig(data: WebsiteSmartAlertConfig): Observable<WebsiteSmartAlertConfigWithMetadata> {
  return http<WebsiteSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(
  data: WebsiteSmartAlertConfig,
  id: string
): Observable<WebsiteSmartAlertConfigWithMetadata> {
  return http<WebsiteSmartAlertConfigWithMetadata>({
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
): Observable<Result<WebsiteSmartAlertConfigWithMetadata[]>>;
export function getAllAlertConfigs(
  websiteId?: string,
  config?: { asObservable: boolean }
): Observable<WebsiteSmartAlertConfigWithMetadata[]>;
export function getAllAlertConfigs(
  websiteId?: string,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<WebsiteSmartAlertConfigWithMetadata[]>> | Observable<WebsiteSmartAlertConfigWithMetadata[]> {
  const request = http<WebsiteSmartAlertConfigWithMetadata[]>({
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
): Observable<Result<WebsiteSmartAlertConfigWithMetadata>>;
export function getLatestAlertConfig(
  id: string,
  config?: { asObservable: boolean }
): Observable<WebsiteSmartAlertConfigWithMetadata>;
export function getLatestAlertConfig(
  id: string,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<WebsiteSmartAlertConfigWithMetadata>> | Observable<WebsiteSmartAlertConfigWithMetadata> {
  const request = http<WebsiteSmartAlertConfigWithMetadata>({
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
): Observable<Result<WebsiteSmartAlertConfigWithMetadata>>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: boolean }
): Observable<WebsiteSmartAlertConfigWithMetadata>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: boolean } = { asObservable: false }
): Observable<Result<WebsiteSmartAlertConfigWithMetadata>> | Observable<WebsiteSmartAlertConfigWithMetadata> {
  const request = http<WebsiteSmartAlertConfigWithMetadata>({
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
  return enableAlertConfigApi(id, baseUrl);
}

export function disableAlertConfig(id: string): Observable<void> {
  return disableAlertConfigApi(id, baseUrl);
}

export function deleteAlertConfig(id: string): Observable<void> {
  return deleteAlertConfigApi(id, baseUrl);
}

export function restoreAlertConfigVersion(
  id: string,
  created: number
): Observable<WebsiteSmartAlertConfigWithMetadata> {
  return http<WebsiteSmartAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
