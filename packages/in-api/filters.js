/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getAllFilters() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/filters`
  }).map(response => {
    response.body.sort((a, b) => a.name.localeCompare(b.name));
    return fromJS(response.body);
  });
}

export function saveNewFilter(name, definition) {
  return http({
    method: 'POST',
    url: `/api/filters`,
    headers: getCsrfHeader(),
    data: {
      name,
      definition
    }
  }).map(response => response.body);
}

export function saveFilter(id, name, definition) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/filters/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: {
      id,
      name,
      definition
    }
  }).map(response => response.body);
}

export function removeFilter(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/filters/${encodeURIComponent(id)}`
  }).map(response => response.body);
}
