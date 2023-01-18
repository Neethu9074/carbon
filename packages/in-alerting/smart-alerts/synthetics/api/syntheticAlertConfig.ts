/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, ConfigVersion, Result } from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const baseUrl = '/api/events/settings/global-alert-configs/synthetics';

export function createAlertConfig(data: SyntheticAlertConfig): Observable<SyntheticAlertConfigWithMetadata> {
  return http<SyntheticAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(
  data: SyntheticAlertConfig,
  id: string
): Observable<SyntheticAlertConfigWithMetadata> {
  return http<SyntheticAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}

export function getAllAlertConfigs(
  testId: string,
  config: { asObservable: true }
): Observable<Result<SyntheticAlertConfigWithMetadata[]>>;
export function getAllAlertConfigs(
  testId: string,
  config?: { asObservable: false }
): Observable<SyntheticAlertConfigWithMetadata[]>;
export function getAllAlertConfigs(
  testId: string,
  config = { asObservable: false }
): Observable<Result<SyntheticAlertConfigWithMetadata[]>> | Observable<SyntheticAlertConfigWithMetadata[]> {
  const request = http<SyntheticAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      testId
    },
    url: baseUrl
  });
  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getAllVersionsOfAlertConfig(
  id: string,
  config: { asObservable: true }
): Observable<Result<ConfigVersion[]>>;
export function getAllVersionsOfAlertConfig(id: string, config?: { asObservable: false }): Observable<ConfigVersion[]>;
export function getAllVersionsOfAlertConfig(
  id: string,
  config = { asObservable: false }
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
  config: { asObservable: true }
): Observable<Result<SyntheticAlertConfigWithMetadata>>;
export function getLatestAlertConfig(
  id: string,
  config?: { asObservable: false }
): Observable<SyntheticAlertConfigWithMetadata>;
export function getLatestAlertConfig(
  id: string,
  config = { asObservable: false }
): Observable<Result<SyntheticAlertConfigWithMetadata>> | Observable<SyntheticAlertConfigWithMetadata> {
  const request = http<SyntheticAlertConfigWithMetadata>({
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
  config: { asObservable: true }
): Observable<Result<SyntheticAlertConfigWithMetadata>>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<SyntheticAlertConfigWithMetadata>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
): Observable<Result<SyntheticAlertConfigWithMetadata>> | Observable<SyntheticAlertConfigWithMetadata> {
  const request = http<SyntheticAlertConfigWithMetadata>({
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

export function restoreAlertConfigVersion(id: string, created: number): Observable<SyntheticAlertConfigWithMetadata> {
  return http<SyntheticAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
