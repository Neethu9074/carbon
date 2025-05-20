/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import {
  deleteAlertConfig as deleteAlertConfigApi,
  disableAlertConfig as disableAlertConfigApi,
  enableAlertConfig as enableAlertConfigApi
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, ConfigVersion, Result } from 'in-types';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const baseUrl = apiEndpoint.SYNTHETICS;

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
  syntheticTestId: string,
  config: { asObservable: true }
): Observable<Result<SyntheticAlertConfigWithMetadata[]>>;
export function getAllAlertConfigs(
  syntheticTestId?: string,
  config?: { asObservable: false }
): Observable<SyntheticAlertConfigWithMetadata[]>;
export function getAllAlertConfigs(
  syntheticTestId?: string,
  config = { asObservable: false }
): Observable<Result<SyntheticAlertConfigWithMetadata[]>> | Observable<SyntheticAlertConfigWithMetadata[]> {
  const request = http<SyntheticAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      syntheticTestId
    },
    url: baseUrl
  });
  return config.asObservable ? createObservable(request) : request.map(response => response.body);
}

export function getAllAlertConfigsWithResult(): Observable<Result<SyntheticAlertConfigWithMetadata[]>> {
  const request = http<SyntheticAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  });
  return createObservable(request);
}

export const getSyntheticConfigsAsResultObservable = memoize<void, Result<SyntheticAlertConfigWithMetadata[]>>(
  getAllAlertConfigsWithResult,
  () => '',
  minutes.toMillis(2)
);

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
  return enableAlertConfigApi(id, baseUrl);
}

export function disableAlertConfig(id: string): Observable<void> {
  return disableAlertConfigApi(id, baseUrl);
}

export function deleteAlertConfig(id: string): Observable<void> {
  return deleteAlertConfigApi(id, baseUrl);
}

export function restoreAlertConfigVersion(id: string, created: number): Observable<SyntheticAlertConfigWithMetadata> {
  return http<SyntheticAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}
