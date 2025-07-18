/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { DeleteLogsResult } from '@instana/types/typeDefinitions';

import {
  DeleteLogsRequest,
  DeleteLogsV3Request
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

const TIMEOUT = 120000;

export function deleteLogs(params: DeleteLogsRequest) {
  return http<DeleteLogsResult>({
    method: 'DELETE',
    timeout: TIMEOUT,
    maxRetries: 0,
    headers: getCsrfHeader(),
    url: `/api/logging/logs`,
    queryParams: { ...params }
  });
}

export function deleteLogsV3(params: DeleteLogsV3Request) {
  return http<DeleteLogsResult>({
    method: 'DELETE',
    timeout: TIMEOUT,
    maxRetries: 0,
    headers: getCsrfHeader(),
    url: '/api/logging/logs/v3',
    data: params
  });
}
