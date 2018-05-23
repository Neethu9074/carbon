import { mapFromServerResponse, mapToServerResponse } from 'in-applications/keys';
import { generateUniqueShortId } from 'in-services/util/id';
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
    data: enrichWithLabel(mapToServerResponse(config))
  }).map(response => deepFreeze(response.body));
}

export function updateServiceConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/serviceConfigs/${config.id}`,
    data: enrichWithLabel(mapToServerResponse(config))
  }).map(response => deepFreeze(response.body));
}

export function deleteServiceConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/serviceConfigs/${id}`
  });
}

export function newServiceConfig() {
  return {
    id: generateUniqueShortId(),
    name: 'new custom rule name',
    label: 'new custom rule label',
    enabled: true,
    matchSpecification: [
      {
        key: '',
        value: '/(.*)' // the user can't configure the value and empty is not allowed
      }
    ]
  };
}

export function enrichWithLabel(config) {
  config.label = config.matchSpecification.map(config => `{${config.key}}`).join('-');
  return config;
}
