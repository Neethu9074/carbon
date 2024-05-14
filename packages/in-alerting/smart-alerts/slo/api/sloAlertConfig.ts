/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, ServiceLevelsAlertConfig, ServiceLevelsAlertConfigWithMetadata } from '@instana/types';
import { Observable, create } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';

const refreshSignal = create<string>().emit('');

export function createSloAlertConfiguration(
  sloAlertConfig: ServiceLevelsAlertConfig
): Observable<Result<ServiceLevelsAlertConfigWithMetadata>> {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'POST',
    maxRetries: 3,
    url: `/api/events/settings/global-alert-configs/service-levels`,
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
    url: `/api/events/settings/global-alert-configs/service-levels/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: sloAlertConfig,
    treat400AsError: true,
    mapToResultObject: true
  }).map(res => {
    if (res?.data?.name) refreshSignal.emit(res.data.name);
    return res;
  });
}
