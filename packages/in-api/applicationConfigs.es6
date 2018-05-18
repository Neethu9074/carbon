import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';
import { assign } from 'lodash';

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
    maxRetries: 1,
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

export function mapFromServerResponse(response) {
  if (!response.data) {
    return response;
  }

  const matchSpecificationCopy = [];

  for (let i = 0; i < response.data.matchSpecification.length; i++) {
    let matchSpecification = response.data.matchSpecification[i];
    matchSpecificationCopy[i] = {
      key: matchSpecification.key,
      value: matchSpecification.value
    };
    matchSpecification = matchSpecificationCopy[i];

    if (matchSpecification.key.indexOf('docker.label.') === 0) {
      matchSpecification.value = `${matchSpecification.key.slice('docker.label.'.length)}=${matchSpecification.value}`;
      matchSpecification.key = 'docker.label';
    }
  }

  return assign({}, response, {
    data: {
      id: response.data.id,
      label: response.data.label,
      matchSpecification: matchSpecificationCopy
    }
  });
}

export function mapToServerResponse(config) {
  if (!config) {
    return config;
  }

  for (let i = 0; i < config.matchSpecification.length; i++) {
    const matchSpecification = config.matchSpecification[i];
    if (matchSpecification.key === 'docker.label') {
      const indexOfFirstEqual = matchSpecification.value.indexOf('=');
      const stringBeforeEqual = matchSpecification.value.slice(0, Math.max(0, indexOfFirstEqual));
      const stringAfterEqual = indexOfFirstEqual >= 0 ? matchSpecification.value.slice(indexOfFirstEqual + 1) : '';

      matchSpecification.key = `docker.label.${stringBeforeEqual}`;
      matchSpecification.value = stringAfterEqual;
    }
  }
  return config;
}
