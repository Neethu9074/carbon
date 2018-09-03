import { mapFromServerResponse, mapToServerResponse } from 'in-applications/tags';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

export function getEndpointConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function getEndpointConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${id}`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function addEndpointConfig(config) {
  return http({
    method: 'POST',
    url: `/api/httpEndpointConfigs`,
    data: removeNewRuleFlag(mapToServerResponse(config))
  }).map(response => deepFreeze(response.body));
}

export function updateEndpointConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${config.id}`,
    data: removeNewRuleFlag(mapToServerResponse(config))
  }).map(response => deepFreeze(response.body));
}

export function deleteEndpointConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/httpEndpointConfigs/${id}`
  });
}

export function createNewEndpointConfig(endpointId) {
  return {
    id: endpointId,
    isNewRule: true,
    endpointNameByFirstPathSegmentRuleEnabled: true,
    endpointNameByCollectedPathTemplateRuleEnabled: true,
    rules: []
  };
}

export function removeNewRuleFlag(config) {
  delete config.isNewRule;
  return config;
}
