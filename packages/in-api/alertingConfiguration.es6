import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getAlertingConfigs() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/alertingConfigurations`
  }).map(response => fromJS(response.body));
}

export function getAlertingConfig(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/alertingConfigurations/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function setEnabled(config, enabled) {
  return saveAlertingConfig(config.setIn(['muteUntil'], enabled ? 0 : Number.MAX_SAFE_INTEGER));
}

export function saveAlertingConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/alertingConfigurations/${encodeURIComponent(config.get('id'))}`,
    data: config.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteAlertingConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/alertingConfigurations/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createAlertingConfig(
  id,
  alertName = 'New Alert Configuration',
  muteUntil = 0,
  integrationIds = [],
  ruleIds = [],
  query = '',
  eventQuery = '',
  eventTypes = ['incident', 'critical']
) {
  return {
    id: id || generateUniqueShortId(),
    alertName,
    muteUntil,
    integrationIds,
    eventFilteringConfiguration: {
      query,
      eventQuery,
      ruleIds,
      eventTypes
    }
  };
}
