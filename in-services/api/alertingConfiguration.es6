import { fromJS } from 'immutable';

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

export function saveAlertingConfig(config) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/alertingConfigurations/${encodeURIComponent(config.get('id'))}`,
    data: config.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteAlertingConfig(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/alertingConfigurations/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createAlertingConfig(
  id,
  alertName = 'New Alert Configuration',
  integrationIds = [],
  ruleIds = [],
  query = '',
  eventTypes = []
) {
  return {
    id: id || generateUniqueShortId(),
    alertName,
    integrationIds,
    eventFilteringConfiguration: {
      query,
      ruleIds,
      eventTypes
    }
  };
}
