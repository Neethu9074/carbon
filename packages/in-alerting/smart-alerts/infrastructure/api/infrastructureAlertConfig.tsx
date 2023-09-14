/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { InfraAlertConfigWithMetadata, Result } from 'in-types';
import http from 'in-services/http';

const baseUrl = apiEndpoint.INFRA;

function getRequest(id: string, timestamp: number) {
  return http<InfraAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  });
}

export function getAllAlertConfigs(id: string, timestamp: number): Observable<InfraAlertConfigWithMetadata> {
  const request = getRequest(id, timestamp);
  return request.map(response => response.body);
}

export function getAllAlertConfigsWithResult(): Observable<Result<InfraAlertConfigWithMetadata[]>> {
  const request = http<InfraAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  });
  return createObservable(request);
}
