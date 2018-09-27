import { header as csrfHeader } from 'in-services/security/csrf';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

export function getEndpointConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs`,
    mapToResultObject: true
  });
}

export function getEndpointConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${id}`,
    mapToResultObject: true
  });
}

export function addEndpointConfig(config) {
  return http({
    method: 'POST',
    url: `/api/httpEndpointConfigs`,
    headers: csrfHeader,
    data: config
  }).map(response => deepFreeze(response.body));
}

export function updateEndpointConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${config.serviceId}`,
    headers: csrfHeader,
    data: config
  }).map(response => deepFreeze(response.body));
}

export function deleteEndpointConfig(serviceId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: csrfHeader,
    url: `/api/httpEndpointConfigs/${serviceId}`
  });
}

export function testRules(rules) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/testRules`,
    headers: csrfHeader,
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
