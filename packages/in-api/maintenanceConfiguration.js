/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import { generateUniqueShortId } from '@instana/utils';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getMaintenanceConfigs() {
  return getMaintenanceConfigsMutable().map(fromJS);
}

export function getMaintenanceConfigsMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/maintenanceConfigs`
  }).map(response => response.body);
}

export function getMaintenanceConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/maintenanceConfigs/${encodeURIComponent(id)}`,
    treat400AsError: false
  }).map(response => fromJS(response.body));
}

export function saveMaintenanceConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/maintenanceConfigs/${encodeURIComponent(config.get('id'))}`,
    data: config.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteMaintenanceConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/maintenanceConfigs/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createMaintenanceConfig(id, name = 'New Maintenance Configuration', query = '', windows = []) {
  return {
    id: id || generateUniqueShortId(),
    name,
    query,
    windows
  };
}

export function createMaintenanceWindow(id, start, end) {
  return {
    id: id || generateUniqueShortId(),
    start,
    end
  };
}
