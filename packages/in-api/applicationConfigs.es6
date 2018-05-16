import { assign } from 'lodash';

import { deepFreeze } from 'in-services/util/object';
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

function mapFromServerResponse(response) {
  if (response.data) {
    for (let i = 0; i < response.data.matchSpecification.length; i++) {
      const matchSpecification = response.data.matchSpecification[i];
      console.log(matchSpecification);
    }
  }
  return response;
}

function mapToServerResponse(config) {
  if (config) {
    for (let i = 0; i < config.matchSpecification.length; i++) {
      const matchSpecification = config.matchSpecification[i];
      console.log(matchSpecification);
    }
  }
  return config;
}
