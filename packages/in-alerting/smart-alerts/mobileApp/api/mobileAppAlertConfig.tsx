/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { MobileAppAlertConfigWithMetadata, Result } from 'in-types';
import http from 'in-services/http';

const baseUrl = 'api/events/settings/mobile-app-alert-configs';

function getRequest(id: string, timestamp: number) {
  return http<MobileAppAlertConfigWithMetadata>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  });
}

export function getAllAlertConfigs(id: string, timestamp: number): Observable<MobileAppAlertConfigWithMetadata> {
  const request = getRequest(id, timestamp);
  return request.map(response => response.body);
}

export function getAllAlertConfigsWithResult(
  id: string,
  timestamp: number
): Observable<Result<MobileAppAlertConfigWithMetadata>> {
  const request = getRequest(id, timestamp);
  return createObservable(request);
}
