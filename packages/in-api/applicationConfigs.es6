import { mapFromServerResponse, mapToServerResponse } from 'in-applications/tags';
import { deepFreeze } from 'in-services/util/object';
import { createTracker } from 'in-services/tracking/mixpanel';
import http, { isSuccess } from 'in-services/http';

const trackCreateApplication = createTracker('application.create');
const trackUpdateApplication = createTracker('application.update');
const trackDeleteApplication = createTracker('application.delete');

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
  })
    .tap(response => {
      trackOnSuccess(response, trackCreateApplication, config);
    })
    .map(response => deepFreeze(response.body));
}

export function updateApplicationConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/applicationConfigs/${config.id}`,
    data: mapToServerResponse(config)
  })
    .tap(response => {
      trackOnSuccess(response, trackUpdateApplication, config);
    })
    .map(response => deepFreeze(response.body));
}

export function deleteApplicationConfig(id, label) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/applicationConfigs/${id}`
  }).tap(response => {
    trackOnSuccess(response, trackDeleteApplication, { id, label });
  });
}

export function createNewApplicationConfig() {
  return {
    label: '',
    matchSpecification: [{}]
  };
}

function trackOnSuccess(response, tracker, config = {}) {
  if (isSuccess(response)) {
    tracker(config);
  }
}
