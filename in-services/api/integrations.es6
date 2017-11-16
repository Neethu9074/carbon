import { fromJS } from 'immutable';

import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getIntegrations() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/integrations`
  }).map(response => fromJS(response.body));
}

export function getIntegration(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/integrations/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function saveIntegration(integration) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/integrations/${encodeURIComponent(integration.get('id'))}`,
    data: integration.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteIntegration(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/integrations/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createIntegration(id, kind = 'pagerduty', configuration = {}) {
  return {
    id: id || generateUniqueShortId(),
    kind,
    configuration
  };
}
