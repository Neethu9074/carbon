/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Result, TagCatalog } from '@instana/types';
import { Observable } from '@instana/observables';

import http from 'in-services/http';

const basePath = '/api/business-monitoring/catalog';

export function getBusinessMonitoringTagCatalog(): Observable<Result<TagCatalog>> {
  return http<TagCatalog>({
    method: 'GET',
    maxRetries: 3,
    url: basePath,
    mapToResultObject: true
  });
}
