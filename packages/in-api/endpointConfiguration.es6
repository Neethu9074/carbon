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
    data: mapToServerModel(config)
  }).map(response => deepFreeze(response.body));
}

export function updateEndpointConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${config.serviceId}`,
    data: mapToServerModel(config)
  }).map(response => deepFreeze(response.body));
}

export function deleteEndpointConfig(serviceId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${serviceId}`
  });
}

export function testRules(rules) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/testRules`,
    data: rules
  }).map(response => deepFreeze(response.body));
}

export function createNewEndpointConfig(serviceId) {
  return {
    serviceId,
    isNewRule: true,
    endpointNameByFirstPathSegmentRuleEnabled: true,
    endpointNameByCollectedPathTemplateRuleEnabled: true,
    rules: []
  };
}

function mapToServerModel(config) {
  delete config.isNewRule;
  return config;
}
