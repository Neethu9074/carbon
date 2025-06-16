/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import {
  ApplicationSmartAlertConfig,
  ApplicationSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { ConfigVersion, Result } from 'in-types';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const baseUrl = apiEndpoint.APPLICATION;

export function createAlertConfig(
  data: ApplicationSmartAlertConfig
): Observable<ApplicationSmartAlertConfigWithMetadata> {
  return http<ApplicationSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(
  data: ApplicationSmartAlertConfig,
  id: string
): Observable<ApplicationSmartAlertConfigWithMetadata> {
  return http<ApplicationSmartAlertConfigWithMetadata>({
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
): Observable<Result<ApplicationSmartAlertConfigWithMetadata[]>>;
export function getAllAlertConfigs(
  applicationId: string,
  config?: { asObservable: false }
): Observable<ApplicationSmartAlertConfigWithMetadata[]>;
export function getAllAlertConfigs(
  applicationId: string,
  config = { asObservable: false }
):
  | Observable<Result<ApplicationSmartAlertConfigWithMetadata[]>>
  | Observable<ApplicationSmartAlertConfigWithMetadata[]> {
  const request = http<ApplicationSmartAlertConfigWithMetadata[]>({
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
): Observable<Result<ApplicationSmartAlertConfigWithMetadata>>;
export function getLatestAlertConfig(
  id: string,
  config?: { asObservable: false }
): Observable<ApplicationSmartAlertConfigWithMetadata>;
export function getLatestAlertConfig(
  id: string,
  config = { asObservable: false }
): Observable<Result<ApplicationSmartAlertConfigWithMetadata>> | Observable<ApplicationSmartAlertConfigWithMetadata> {
  const request = http<ApplicationSmartAlertConfigWithMetadata>({
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
): Observable<Result<ApplicationSmartAlertConfigWithMetadata>>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<ApplicationSmartAlertConfigWithMetadata>;
export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
): Observable<Result<ApplicationSmartAlertConfigWithMetadata>> | Observable<ApplicationSmartAlertConfigWithMetadata> {
  const request = http<ApplicationSmartAlertConfigWithMetadata>({
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

export function getAllAlertConfigsForAllApplications(
  alertIds: string[],
  config: { asObservable: true }
): Observable<Result<ApplicationSmartAlertConfigWithMetadata[]>>;
export function getAllAlertConfigsForAllApplications(
  alertIds: string[],
  config: { asObservable: false }
): Observable<ApplicationSmartAlertConfigWithMetadata[]>;
export function getAllAlertConfigsForAllApplications(
  alertIds: string[],
  config = { asObservable: false }
):
  | Observable<Result<ApplicationSmartAlertConfigWithMetadata[]>>
  | Observable<ApplicationSmartAlertConfigWithMetadata[]> {
  const request = http<ApplicationSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      alertIds
    },
    url: baseUrl
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getAlertConfigsForAllApplications(): Observable<Result<ApplicationSmartAlertConfigWithMetadata[]>> {
  const request = http<ApplicationSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  });
  return createObservable(request);
}

export const getConfigsForAllApplicationsAsResultObservable = memoize<
  void,
  Result<ApplicationSmartAlertConfigWithMetadata[]>
>(getAlertConfigsForAllApplications, () => '', minutes.toMillis(2));

export function restoreAlertConfigVersion(
  id: string,
  created: number
): Observable<ApplicationSmartAlertConfigWithMetadata> {
  return http<ApplicationSmartAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
