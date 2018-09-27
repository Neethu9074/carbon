import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { getKeyValuePairTag } from 'in-applications/tags';
import { deepFreeze } from 'in-services/util/object';
import { deepCopy } from 'in-services/util/object';
import http from 'in-services/http';

export function getApplicationConfigs() {
  return http({
    method: 'GET',
    maxRetries: 1,
    timeout: 1000,
    url: `/api/applicationConfigs`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function getApplicationConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/applicationConfigs/${encodeURIComponent(id)}`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function addApplicationConfig(config) {
  return http({
    method: 'POST',
    url: `/api/applicationConfigs`,
    headers: getCsrfHeader(),
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function updateApplicationConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/applicationConfigs/${config.id}`,
    headers: getCsrfHeader(),
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function deleteApplicationConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/applicationConfigs/${id}`
  });
}

export function createNewApplicationConfig() {
  return {
    label: '',
    matchSpecification: []
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

function mapFromServerResponse(config) {
  if (!config.data) {
    return config;
  }

  config = deepCopy(config);

  for (let i = 0; i < config.data.matchSpecification.length; i++) {
    const matchSpecification = config.data.matchSpecification[i];

    const keyValueTag = getKeyValuePairTag(matchSpecification.key);
    if (keyValueTag) {
      const name = keyValueTag.fullyQualifiedName;
      const secondLevelName = matchSpecification.key.slice(name.length + 1); // remove the  first .
      if (secondLevelName) {
        matchSpecification.secondLevelName = secondLevelName;
      }
      matchSpecification.key = name;
    }
  }

  return config;
}
