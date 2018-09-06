import { deepCopy, deepFreeze } from 'in-services/util/object';
import { getKeyValuePairTag } from 'in-applications/tags';
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

function mapToServerResponse(config) {
  for (let i = 0; i < config.matchSpecification.length; i++) {
    const matchSpecification = config.matchSpecification[i];
    if (matchSpecification.secondLevelName) {
      matchSpecification.key = `${matchSpecification.key}.${matchSpecification.secondLevelName}`;
      delete matchSpecification.secondLevelName;
    }
  }
  return config;
}

function mapFromServerResponse(response) {
  if (!response.data) {
    return response;
  }

  response = deepCopy(response);

  response.data.map(config => {
    for (let i = 0; i < config.matchSpecification.length; i++) {
      const matchSpecification = config.matchSpecification[i];

      const keyValueTag = getKeyValuePairTag(matchSpecification.key);
      if (keyValueTag) {
        const name = keyValueTag.fullyQualifiedName;
        const secondLevelName = matchSpecification.key.slice(name.length + 1); // remove the first .
        if (secondLevelName) {
          matchSpecification.secondLevelName = secondLevelName;
        }
        matchSpecification.key = name;
      }
    }
  });
  return response;
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
