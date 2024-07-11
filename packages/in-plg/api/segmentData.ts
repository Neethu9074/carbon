/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';

const baseUrl = '/tracking/intentToPurchase';

export function sendSegmentEvent(data: segmentData): Observable<segmentData> {
  return http<segmentData>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}`,
    data
  }).map(response => response.body);
}

export interface segmentData {
  eventName: String;
}
