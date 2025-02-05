/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ConfigVersion, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import {
  deleteAlertConfig as deleteAlertConfigApi,
  disableAlertConfig as disableAlertConfigApi,
  enableAlertConfig as enableAlertConfigApi
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
import {
  LogSmartAlertConfigWithMetadata,
  LogSmartAlertConfig
} from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const baseUrl = apiEndpoint.LOGS;

export function getAllAlertConfigsWithResult(): Observable<Result<LogSmartAlertConfigWithMetadata[]>> {
  const request = http<LogSmartAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
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

function getRequest(id: string, timestamp: number) {
  return http<LogSmartAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  });
}

export function getAllAlertConfigs(id: string, timestamp: number): Observable<LogSmartAlertConfigWithMetadata> {
  const request = getRequest(id, timestamp);
  return request.map(response => response.body);
}

export function getAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number
): Observable<Result<LogSmartAlertConfigWithMetadata>> {
  const request = http<LogSmartAlertConfigWithMetadata>({
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

export function getLatestAlertConfig(id: string): Observable<Result<LogSmartAlertConfigWithMetadata>> {
  const request = http<LogSmartAlertConfigWithMetadata>({
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

export function restoreAlertConfigVersion(id: string, created: number): Observable<LogSmartAlertConfigWithMetadata> {
  return http<LogSmartAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/restore/${created}`
  }).map(response => response.body);
}

export function createAlertConfig(data: LogSmartAlertConfig): Observable<LogSmartAlertConfigWithMetadata> {
  return http<LogSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(data: LogSmartAlertConfig, id: string): Observable<LogSmartAlertConfigWithMetadata> {
  return http<LogSmartAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}
