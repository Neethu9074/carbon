/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import http from 'in-services/http';
import { DeleteLogsResult } from '@instana/types/typeDefinitions';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import {
  DeleteLogsRequest,
  DeleteLogsV3Request
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';

export function deleteLogs(params: DeleteLogsRequest) {
  return http<DeleteLogsResult>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/logging/logs`,
    queryParams: { ...params }
  });
}

export function deleteLogsV3(params: DeleteLogsV3Request) {
  return http<DeleteLogsResult>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: '/api/logging/logs/v3',
    data: params
  })
}
