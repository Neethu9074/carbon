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
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { ConfigVersion, InfraAlertConfig, Result } from 'in-types';
import { minutes } from 'in-services/time';
import http from 'in-services/http';

const baseUrl = apiEndpoint.INFRA;

function getRequest(id: string, timestamp: number) {
  return http<InfraSmartAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  });
}

export function getAllAlertConfigs(id: string, timestamp: number): Observable<InfraSmartAlertConfigWithMetadata> {
  const request = getRequest(id, timestamp);
  return request.map(response => response.body);
}

export function getAllAlertConfigsWithResult(): Observable<Result<InfraSmartAlertConfigWithMetadata[]>> {
  const request = http<InfraSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  });
  return createObservable(request);
}

export const getInfraConfigsAsResultObservable = memoize<void, Result<InfraSmartAlertConfigWithMetadata[]>>(
  getAllAlertConfigsWithResult,
  () => '',
  minutes.toMillis(2)
);

export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number
): Observable<Result<InfraSmartAlertConfigWithMetadata>> {
  const request = http<InfraSmartAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  });

  return createObservable(request);
}

export function getLatestAlertConfig(id: string): Observable<Result<InfraSmartAlertConfigWithMetadata>> {
  const request = http<InfraSmartAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  });

  return createObservable(request);
}

export function getAllVersionsOfAlertConfig(id: string): Observable<Result<ConfigVersion[]>> {
  const request = http<ConfigVersion[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/versions`
  });

  return createObservable(request);
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

export function restoreAlertConfigVersion(id: string, created: number): Observable<InfraSmartAlertConfigWithMetadata> {
  return http<InfraSmartAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}

export function createAlertConfig(data: InfraAlertConfig): Observable<InfraSmartAlertConfigWithMetadata> {
  return http<InfraSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(data: InfraAlertConfig, id: string): Observable<InfraSmartAlertConfigWithMetadata> {
  return http<InfraSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}
