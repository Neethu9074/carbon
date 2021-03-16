/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { compareIgnoreCase } from 'in-services/util/string';
import http from 'in-services/http';

export function getWebsites() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/website-monitoring/config`
  }).map(response => {
    const keys = response.body || [];
    keys.sort((a, b) => compareIgnoreCase(a.name, b.name));
    return keys;
  });
}

export function removeWebsite(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addWebsite(name) {
  return http({
    method: 'POST',
    url: `/api/website-monitoring/config`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response.body);
}

export function renameWebsite(id, name) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    queryParams: {
      name
    }
  }).map(response => response);
}

export function getSourceMapConfigurations(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(id)}/sourceMap`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function addSourceMapConfiguration(websiteId, config) {
  return http({
    method: 'POST',
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMap`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function updateSourceMapConfiguration(websiteId, config) {
  return http({
    method: 'PUT',
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMap/${encodeURIComponent(config.id)}`,
    headers: getCsrfHeader(),
    data: config
  }).map(response => response.body);
}

export function removeSourceMapConfiguration(websiteId, sourceMapConfigId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/website-monitoring/config/${encodeURIComponent(websiteId)}/sourceMap/${encodeURIComponent(
      sourceMapConfigId
    )}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}
