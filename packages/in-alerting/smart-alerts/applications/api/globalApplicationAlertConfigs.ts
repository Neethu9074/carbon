/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Observable } from '@instana/observables';

import {
  GlobalApplicationsSmartAlertConfig,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { ConfigVersion, Result } from 'in-types';
import http from 'in-services/http';

const baseUrl = apiEndpoint.APPLICATION_GLOBAL;

export function createGlobalAlertConfig(
  data: GlobalApplicationsSmartAlertConfig
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata> {
  return http<GlobalApplicationsSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateGlobalAlertConfig(
  data: GlobalApplicationsSmartAlertConfig,
  id: string
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata> {
  return http<GlobalApplicationsSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}

export function getAllGlobalAlertConfigs(
  alertIds: string[],
  config: { asObservable: true }
): Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>>;
export function getAllGlobalAlertConfigs(
  alertIds: string[],
  config?: { asObservable: false }
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata[]>;
export function getAllGlobalAlertConfigs(
  alertIds: string[],
  config = { asObservable: false }
):
  | Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>>
  | Observable<GlobalApplicationsSmartAlertConfigWithMetadata[]> {
  const request = http<GlobalApplicationsSmartAlertConfigWithMetadata[]>({
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

export function getAllGlobalAlertConfigsRelatedToApplicationId(
  applicationId: string,
  config: { asObservable: true }
): Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>>;
export function getAllGlobalAlertConfigsRelatedToApplicationId(
  applicationId: string,
  config?: { asObservable: false }
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata[]>;
export function getAllGlobalAlertConfigsRelatedToApplicationId(
  applicationId: string,
  config = { asObservable: false }
):
  | Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>>
  | Observable<GlobalApplicationsSmartAlertConfigWithMetadata[]> {
  const request = http<GlobalApplicationsSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: { applicationId },
    url: baseUrl
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getLatestGlobalAlertConfig(
  id: string,
  config: { asObservable: true }
): Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata>>;
export function getLatestGlobalAlertConfig(
  id: string,
  config?: { asObservable: false }
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata>;
export function getLatestGlobalAlertConfig(
  id: string,
  config = { asObservable: false }
):
  | Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata>>
  | Observable<GlobalApplicationsSmartAlertConfigWithMetadata> {
  const request = http<GlobalApplicationsSmartAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getGlobalAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: true }
): Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata>>;
export function getGlobalAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata>;
export function getGlobalAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
):
  | Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata>>
  | Observable<GlobalApplicationsSmartAlertConfigWithMetadata> {
  const request = http<GlobalApplicationsSmartAlertConfigWithMetadata>({
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

export function enableGlobalAlertConfig(id: string, config: { asObservable: true }): Observable<Result<void>>;
export function enableGlobalAlertConfig(id: string, config?: { asObservable: false }): Observable<void>;
export function enableGlobalAlertConfig(
  id: string,
  config = { asObservable: false }
): Observable<Result<void>> | Observable<void> {
  const request = http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/enable`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function disableGlobalAlertConfig(id: string, config: { asObservable: true }): Observable<Result<void>>;
export function disableGlobalAlertConfig(id: string, config?: { asObservable: false }): Observable<void>;
export function disableGlobalAlertConfig(
  id: string,
  config = { asObservable: false }
): Observable<Result<void>> | Observable<void> {
  const request = http<void>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/disable`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function deleteGlobalAlertConfig(id: string, config: { asObservable: true }): Observable<Result<void>>;
export function deleteGlobalAlertConfig(id: string, config?: { asObservable: false }): Observable<void>;
export function deleteGlobalAlertConfig(
  id: string,
  config = { asObservable: false }
): Observable<Result<void>> | Observable<void> {
  const request = http<void>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getAllVersionsOfGlobalAlertConfig(
  id: string,
  config: { asObservable: true }
): Observable<Result<ConfigVersion[]>>;
export function getAllVersionsOfGlobalAlertConfig(
  id: string,
  config?: { asObservable: false }
): Observable<ConfigVersion[]>;
export function getAllVersionsOfGlobalAlertConfig(
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

export function getAllBuiltInGlobalSmartAlerts(config: {
  asObservable: true;
}): Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>>;
export function getAllBuiltInGlobalSmartAlerts(config?: {
  asObservable: false;
}): Observable<GlobalApplicationsSmartAlertConfigWithMetadata[]>;
export function getAllBuiltInGlobalSmartAlerts(
  config = { asObservable: false }
):
  | Observable<Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>>
  | Observable<GlobalApplicationsSmartAlertConfigWithMetadata[]> {
  const request = http<GlobalApplicationsSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/builtIn`
  });

  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function restoreGlobalAlertConfigVersion(
  id: string,
  created: number
): Observable<GlobalApplicationsSmartAlertConfigWithMetadata> {
  return http<GlobalApplicationsSmartAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
