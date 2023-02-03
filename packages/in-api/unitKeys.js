/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import http from 'in-services/http';

export function getUnitKeys() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/keys`
  }).map(response => response.body);
}
