import { deepFreeze } from 'in-services/util/object';
import http from 'in-services/http';

export function getApplicationConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/applicationConfigs`
  }).map(response => deepFreeze(response.body));
}

export function getApplicationConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/applicationConfig/${encodeURIComponent(id)}`
  }).map(response => deepFreeze(response.body));
}

export function addApplicationConfig(config) {
  return http({
    method: 'POST',
    maxRetries: 1,
    url: `/api/applicationConfig`,
    data: config
  }).map(response => deepFreeze(response.body));
}

export function updateApplicationConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/applicationConfig/${config.id}`,
    data: config
  }).map(response => deepFreeze(response.body));
}

export function deleteApplicationConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/applicationConfig/${id}`
  });
}
