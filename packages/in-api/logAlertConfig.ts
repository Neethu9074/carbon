/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';
import { Result } from 'in-types';

const baseUrl = 'api/events/settings/global-alert-configs/logs';

export function getLogAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config: { asObservable: true }
): Observable<Result<LogSmartAlertConfigWithMetadata>>;
export function getLogAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config?: { asObservable: false }
): Observable<LogSmartAlertConfigWithMetadata>;
export function getLogAlertConfigByIdAndTimestamp(
  id: string,
  timestamp: number,
  config = { asObservable: false }
): Observable<Result<LogSmartAlertConfigWithMetadata>> | Observable<LogSmartAlertConfigWithMetadata> {
  const request = http<LogSmartAlertConfigWithMetadata>({
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
