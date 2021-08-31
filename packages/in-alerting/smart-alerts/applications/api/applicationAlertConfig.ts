/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { ApplicationAlertConfig, ApplicationAlertConfigWithMetadata, ConfigVersion, Result } from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const baseUrl = 'api/events/settings/application-alert-configs';

export function createAlertConfig(data: ApplicationAlertConfig): Observable<ApplicationAlertConfigWithMetadata> {
  return http<ApplicationAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(
  data: ApplicationAlertConfig,
  id: string
): Observable<ApplicationAlertConfigWithMetadata> {
  return http<ApplicationAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}

export function getAllAlertConfigs(
  applicationId: string,
  config: { asObservable: true }
): Observable<Result<ApplicationAlertConfigWithMetadata[]>>;
export function getAllAlertConfigs(
  applicationId: string,
  config?: { asObservable: false }
): Observable<ApplicationAlertConfigWithMetadata[]>;
export function getAllAlertConfigs(
  applicationId: string,
  config = { asObservable: false }
): Observable<Result<ApplicationAlertConfigWithMetadata[]>> | Observable<ApplicationAlertConfigWithMetadata[]> {
  const request = http<ApplicationAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      applicationId
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
): Observable<Result<ApplicationAlertConfigWithMetadata>>;
export function getLatestAlertConfig(
  id: string,
  config?: { asObservable: false }
): Observable<ApplicationAlertConfigWithMetadata>;
export function getLatestAlertConfig(
  id: string,
  config = { asObservable: false }
): Observable<Result<ApplicationAlertConfigWithMetadata>> | Observable<ApplicationAlertConfigWithMetadata> {
  const request = http<ApplicationAlertConfigWithMetadata>({
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
): Observable<Result<ApplicationAlertConfigWithMetadata>>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<ApplicationAlertConfigWithMetadata>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
): Observable<Result<ApplicationAlertConfigWithMetadata>> | Observable<ApplicationAlertConfigWithMetadata> {
  const request = http<ApplicationAlertConfigWithMetadata>({
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

export function getAllAlertConfigsForAllApplications(config: {
  asObservable: true;
}): Observable<Result<ApplicationAlertConfigWithMetadata[]>>;
export function getAllAlertConfigsForAllApplications(config: {
  asObservable: false;
}): Observable<ApplicationAlertConfigWithMetadata[]>;
export function getAllAlertConfigsForAllApplications(
  config = { asObservable: false }
): Observable<Result<ApplicationAlertConfigWithMetadata[]>> | Observable<ApplicationAlertConfigWithMetadata[]> {
  const request = http<ApplicationAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function restoreAlertConfigVersion(id: string, created: number): Observable<ApplicationAlertConfigWithMetadata> {
  return http<ApplicationAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
