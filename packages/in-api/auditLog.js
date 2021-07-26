/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

const auditLogEndpoint = '/api/settings/auditlog';
const accessLogEndpoint = '/api/settings/accesslog';

export function getAuditLogEndpoint() {
  return auditLogEndpoint;
}

export function getAccessLogEndpoint() {
  return accessLogEndpoint;
}

export function getAuditLog(offset, query, pageSize) {
  return http({
    method: 'GET',
    url: auditLogEndpoint,
    maxRetries: 3,
    queryParams: {
      offset,
      query,
      pageSize
    }
  }).map(response => response.body);
}

export function getAccessLog(offset, query, pageSize) {
  return http({
    method: 'GET',
    url: accessLogEndpoint,
    maxRetries: 3,
    queryParams: {
      offset,
      query,
      pageSize
    }
  }).map(response => response.body);
}
