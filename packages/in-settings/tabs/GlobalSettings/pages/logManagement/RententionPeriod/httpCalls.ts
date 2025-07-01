/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http/http';

export interface RetentionLogsRequest {
  retentionDays: number;
  reasonForChange: string;
}

interface RetentionLogsResponse {
  retentionDays: number;
}

export function retentionLogsPOST(params: RetentionLogsRequest) {
  return http<void>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/retention/v1`,
    data: { ...params }
  });
}

export function retentionLogsGET() {
  return http<RetentionLogsResponse>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/retention/v1`
  });
}
