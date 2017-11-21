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

export function getIntegrationsByIds(ids) {
  return getIntegrations().map(integrations => {
    if (!integrations) {
      return null;
    }

    const integrationsMap = {};
    integrations.forEach(integration => (integrationsMap[integration.get('id')] = integration));
    return ids.map(id => integrationsMap[id]).filter(resolved => resolved);
  });
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

export function createIntegration(id, kind, name = '') {
  if (!kind) {
    return {
      id: id || generateUniqueShortId(),
      kind: 'email',
      name,
      emails: []
    };
  }
  const integration = {
    id: id || generateUniqueShortId(),
    kind,
    name
  };

  switch (kind) {
    case 'email':
      integration.emails = [];
      break;
    case 'office365':
      integration.webhookUrl = '';
      break;
  }

  return integration;
}
