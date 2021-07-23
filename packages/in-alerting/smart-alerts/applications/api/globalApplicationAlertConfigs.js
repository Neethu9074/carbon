/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import http from 'in-services/http';

const baseUrl = '/api/events/settings/global-alert-configs/applications';

export function createGlobalAlertConfig(data) {
  // TODO use createObservable
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateGlobalAlertConfig(data, id) {
  // TODO use createObservable
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}

export function getAllGlobalAlertConfigs(config = { asObservable: false }) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, config = { asObservable: false }) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: { applicationId },
    url: baseUrl
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function getLatestGlobalAlertConfig(id, config = { asObservable: false }) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function getGlobalAlertConfigByIdAndTimestamp(id, timestamp, config = { asObservable: false }) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function enableGlobalAlertConfig(id, config = { asObservable: false }) {
  const requestConfig = {
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/enable`
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function disableGlobalAlertConfig(id, config = { asObservable: false }) {
  const requestConfig = {
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/disable`
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function deleteGlobalAlertConfig(id, config = { asObservable: false }) {
  const requestConfig = {
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function getAllVersionsOfGlobalAlertConfig(id, config = { asObservable: false }) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/versions`
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}

export function getAllBuiltInGlobalSmartAlerts(config = { asObservable: false }) {
  const requestConfig = {
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/builtIn`
  };

  return config.asObservable
    ? createObservable(http(requestConfig))
    : http(requestConfig).map(response => response.body);
}
