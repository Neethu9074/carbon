/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

const baseUrl = 'api/events/settings/website-alert-configs';

export function createAlertConfig(data) {
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: baseUrl,
    data
  }).map(response => response.body);
}

export function updateAlertConfig(data, id) {
  return http({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    data
  }).map(response => response.body);
}

export function getAllAlertConfigs(websiteId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    queryParams: {
      websiteId
    },
    url: baseUrl
  }).map(response => response.body);
}

export function getAllVersionsOfAlertConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/versions`
  }).map(response => response.body);
}

export function getLatestAlertConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  }).map(response => response.body);
}

export function getAlertConfigByIdAndTimestamp(id, timestamp) {
  return http({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`,
    queryParams: {
      validOn: timestamp
    }
  }).map(response => response.body);
}

export function enableAlertConfig(id) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/enable`
  }).map(response => response.body);
}

export function disableAlertConfig(id) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}/disable`
  }).map(response => response.body);
}

export function deleteAlertConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${baseUrl}/${id}`
  }).map(response => response.body);
}
