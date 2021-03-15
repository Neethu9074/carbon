/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { deepCopy, deepFreeze } from 'in-services/util/object';
import { getKeyValuePairTag } from 'in-applications/tags';
import http from 'in-services/http';

const basePath = '/api/application-monitoring/settings/service';

export function getServiceConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `${basePath}`,
    mapToResultObject: true
  }).map(mapFromServerResponse);
}

export function replaceAllServiceConfigs(configs) {
  return http({
    method: 'PUT',
    url: `${basePath}`,
    headers: getCsrfHeader(),
    data: configs.map(config => enrichWithLabel(fillEmptyValues(mapToServerResponse(config))))
  }).map(response => deepFreeze(response.body));
}

export function addServiceConfig(config) {
  return http({
    method: 'POST',
    url: `${basePath}`,
    headers: getCsrfHeader(),
    data: enrichWithLabel(fillEmptyValues(mapToServerResponse(config)))
  }).map(response => deepFreeze(response.body));
}

export function updateServiceConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${config.id}`,
    data: enrichWithLabel(fillEmptyValues(mapToServerResponse(config)))
  }).map(response => deepFreeze(response.body));
}

export function deleteServiceConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${basePath}/${id}`
  });
}

export function createNewServiceConfigs() {
  return [
    {
      name: 'custom rule name',
      label: 'custom rule label',
      enabled: true,
      matchSpecification: [
        {
          key: '',
          value: '.*' // default value not editable by user
        }
      ]
    }
  ];
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

      const keyValueTag = getKeyValueTag(matchSpecification.key);
      if (keyValueTag) {
        const name = keyValueTag.fullyQualifiedName;
        const secondLevelName = matchSpecification.key.slice(name.length + 1); // remove the first .
        matchSpecification.key = name;
        if (secondLevelName) {
          matchSpecification.secondLevelName = secondLevelName;
        }
      }
      matchSpecification.value = '.*';
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

function getKeyValueTag(matchSpecificationKey) {
  const keyValuePairTag = getKeyValuePairTag(matchSpecificationKey);
  if (keyValuePairTag) {
    return keyValuePairTag;
  }
  // the 'jvm.args' tag is not part of the /api/tags and needs to be treated explicitly here.
  if (matchSpecificationKey.indexOf('jvm.args') === 0) {
    return { fullyQualifiedName: 'jvm.args' }; // we only need the FQN for mapping
  } else {
    return null;
  }
}
