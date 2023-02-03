/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import { InfraAlertConfigWithMetadata, Result } from 'in-types';
import http from 'in-services/http';

const baseUrl = 'api/events/settings/infra-alert-configs';

export function getInfraAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: true }
): Observable<Result<InfraAlertConfigWithMetadata>>;
export function getInfraAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<InfraAlertConfigWithMetadata>;
export function getInfraAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
): Observable<Result<InfraAlertConfigWithMetadata>> | Observable<InfraAlertConfigWithMetadata> {
  const request = http<InfraAlertConfigWithMetadata>({
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
