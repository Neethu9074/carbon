import { findSubTreeByFullyQualifiedName } from 'in-applications/tags';
import { TAG_TYPES } from 'in-analyze/applicationFilter';
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
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function updateApplicationConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/applicationConfigs/${config.id}`,
    data: mapToServerResponse(config)
  }).map(response => deepFreeze(response.body));
}

export function deleteApplicationConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
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
      matchSpecification.value = `${matchSpecification.secondLevelName}=${matchSpecification.value}`;
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
    let node = findSubTreeByFullyQualifiedName(matchSpecification.key);
    if (node && node.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
      const { key, value } = TAG_TYPES.KEY_VALUE_PAIR.splitValue(matchSpecification.value);
      matchSpecification.secondLevelName = key;
      matchSpecification.value = value;
    }
  }

  return config;
}
