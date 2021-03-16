/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

export function getAgentKey() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/agentKey`
  }).map(response => response.body);
}
