/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, ServiceLevelsAlertConfig, ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Observable, create } from '@instana/observables';

import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';

const refreshSignal = create<string>().emit('');

export function createSloAlertConfiguration(
  sloAlertConfig: ServiceLevelsAlertConfig
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    url: baseUrl.SLO,
    headers: getCsrfHeader(),
    data: sloAlertConfig,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.name) refreshSignal.emit(res.data.name);
    return res;
  });
}

export function updateSloAlertConfiguration(
  sloAlertConfig: ServiceLevelsAlertConfig,
  id: string
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    url: `${baseUrl.SLO}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: sloAlertConfig,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.name) refreshSignal.emit(res.data.name);
    return res;
  });
}

export function getSloAlertConfiguration(
  alertId: string,
  created?: number
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    url: `${baseUrl.SLO}/${encodeURI(alertId)}`,
    headers: getCsrfHeader(),
    queryParams: {
      validOn: created
    },
    treat400AsError: true,
    mapToResultObject: true
  });
}

export function getSloAlertConfigurationVersion(
  alertId: string,
  created: number
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    url: `${baseUrl.SLO}/${encodeURI(alertId)}/versions/${encodeURI(`${created}`)}`,
    headers: getCsrfHeader(),
    treat400AsError: true,
    mapToResultObject: true
  });
}

export function getAllSloAlertConfigurationVersions(
  alertId: string
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    url: `${baseUrl.SLO}/${encodeURI(alertId)}/versions`,
    headers: getCsrfHeader(),
    treat400AsError: true,
    mapToResultObject: true
  });
}

export function restoreSloAlertConfiguration(
  alertId: string,
  version: number
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'PUT',
    maxRetries: 3,
    url: `${baseUrl.SLO}/${encodeURI(alertId)}/restore/${encodeURI(version.toString())}`,
    headers: getCsrfHeader(),
    treat400AsError: true,
    mapToResultObject: true
  });
}

export function getAllSloAlertConfigurations(
  sloId?: string
): Observable<Result<ServiceLevelsAlertConfigWithMetadata[]>> {
  return http<ServiceLevelsAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      sloId
    },
    url: baseUrl.SLO,
    mapToResultObject: true
  });
}
