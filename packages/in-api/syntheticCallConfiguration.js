/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

export function getSyntheticCallConfig() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/synthetic-calls`,
    mapToResultObject: true
  }).map(response => deepFreeze(response));
}

export function updateSyntheticCallConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/synthetic-calls`,
    data: config
  }).map(response => deepFreeze(response.body));
}

export function deleteSyntheticCallConfig() {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/settings/synthetic-calls`
  });
}
