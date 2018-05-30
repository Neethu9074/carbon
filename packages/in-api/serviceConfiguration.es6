import { mapFromServerResponse, mapToServerResponse } from 'in-applications/tags';
import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

export function getServiceConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/serviceConfigs`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function addServiceConfig(config) {
  return http({
    method: 'POST',
    url: `/api/serviceConfigs`,
    data: enrichWithLabel(fillEmptyValues(mapToServerResponse(config)))
  }).map(response => deepFreeze(response.body));
}

export function updateServiceConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/serviceConfigs/${config.id}`,
    data: enrichWithLabel(fillEmptyValues(mapToServerResponse(config)))
  }).map(response => deepFreeze(response.body));
}

export function deleteServiceConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/serviceConfigs/${id}`
  });
}

export function createNewServiceConfig() {
  return {
    name: 'custom rule name',
    label: 'custom rule label',
    enabled: true,
    matchSpecification: [
      {
        key: '',
        value: '/(.*)' // the user maybe can't configure the value and empty is not allowed
      }
    ]
  };
}

export function enrichWithLabel(config) {
  config.label = config.matchSpecification.map(config => `{${config.key}}`).join('-');
  return config;
}

export function fillEmptyValues(config) {
  for (let i = 0; i < config.matchSpecification.length; i++) {
    const element = config.matchSpecification[i];
    element.value = element.value || '.*';
  }
  return config;
}
