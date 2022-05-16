/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

export function getAllActions() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/automation/settings/actions'
  }).map(response => response.body);
}
