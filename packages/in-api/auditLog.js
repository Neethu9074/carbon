/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

export function getAuditLog(offset, query, pageSize) {
  return http({
    method: 'GET',
    url: `/api/auditlog`,
    maxRetries: 3,
    queryParams: {
      offset,
      query,
      pageSize
    }
  }).map(response => response.body);
}
