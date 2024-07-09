/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Observable } from '@instana/observables';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';
import { Result } from 'in-types';

const baseUrl = 'api/events/settings/infra-alert-configs';

export function getInfraAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: true }
): Observable<Result<InfraSmartAlertConfigWithMetadata>>;
export function getInfraAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<InfraSmartAlertConfigWithMetadata>;
export function getInfraAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
): Observable<Result<InfraSmartAlertConfigWithMetadata>> | Observable<InfraSmartAlertConfigWithMetadata> {
  const request = http<InfraSmartAlertConfigWithMetadata>({
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
