/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/settings/http-endpoint';

export function getEndpointConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}`,
    mapToResultObject: true
  });
}

export function getEndpointConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}/${id}`,
    mapToResultObject: true
  });
}

export function addEndpointConfig(config) {
  return http({
    method: 'POST',
    url: `${basePath}`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => deepFreeze(response.body));
}

export function updateEndpointConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${basePath}/${config.serviceId}`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => deepFreeze(response.body));
}

export function deleteEndpointConfig(serviceId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${serviceId}`
  });
}

export function testRules(rules) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `${basePath}/testRules`,
    headers: getCsrfHeader(),
    data: rules
  }).map(response => deepFreeze(response.body));
}

export function createNewEndpointConfig(serviceId) {
  return {
    serviceId,
    endpointNameByFirstPathSegmentRuleEnabled: true,
    endpointNameByCollectedPathTemplateRuleEnabled: true,
    rules: []
  };
}
