/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import http from 'in-services/http';

export function getConfigData() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/settings/export-configuration'
  }).map(res => res.body);
}
