/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { generateUniqueShortId } from 'in-services/util/id';
import { deepCopy } from 'in-services/util/object';
import http from 'in-services/http';

export function getAlertingConfigs() {
  return getAlertingConfigsMutable().map(fromJS);
}

export function getAlertingConfigsMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/alerts`
  }).map(response => response.body);
}

export function getAlertingConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/alerts/${encodeURIComponent(id)}`,
    treat400AsError: false
  }).map(response => fromJS(response.body));
}

export function getAlertsForAlertChannelId(alertChannelId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/alert-configs/infos',
    queryParams: {
      integrationId: alertChannelId
    }
  }).map(response => response.body);
}

export function setEnabled(config, enabled) {
  const copy = deepCopy(config);
  copy.muteUntil = enabled ? 0 : Number.MAX_SAFE_INTEGER;
  return saveAlertingConfigMutable(copy);
}

export function saveAlertingConfig(config) {
  return saveAlertingConfigMutable(config.toJS()).map(fromJS);
}

export function saveAlertingConfigMutable(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alerts/${encodeURIComponent(config.id)}`,
    data: config
  }).map(response => response.body);
}

export function deleteAlertingConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alerts/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createAlertingConfig(
  id,
  alertName = 'New Alert Configuration',
  muteUntil = 0,
  integrationIds = [],
  ruleIds = [],
  query = '',
  eventTypes = [],
  customPayload
) {
  return {
    id: id || generateUniqueShortId(),
    alertName,
    muteUntil,
    integrationIds,
    eventFilteringConfiguration: {
      query,
      ruleIds,
      eventTypes
    },
    customPayload
  };
}
