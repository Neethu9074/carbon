import { fromJS } from 'immutable';

import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getServiceRules(type = null) {
  return http({
    method: 'GET',
    url: `/api/serviceExtractionConfigs`
  }).map(response => {
    const rules = response.body.rules;
    if (type == null) {
      return rules;
    }
    return fromJS(rules.filter(rule => rule.type === type));
  });
}

export function getServiceRule(id) {
  return http({
    method: 'GET',
    url: `/api/serviceExtractionConfigs/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function saveServiceRule(rule) {
  return http({
    method: 'PUT',
    url: `/api/serviceExtractionConfigs/${encodeURIComponent(rule.get('id'))}`,
    data: rule.toJS()
  }).map(() => true);
}

export function upsertServiceRules(rules) {
  return http({
    method: 'PUT',
    url: '/api/serviceExtractionConfigs/type/upsert',
    data: {
      lastModificationTimestamp: Date.now(),
      rules
    }
  }).map(() => true);
}

export function updateServiceRulesByType(rules, type) {
  return http({
    method: 'PUT',
    url: `/api/serviceExtractionConfigs/type/${encodeURIComponent(type)}`,
    data: {
      lastModificationTimestamp: Date.now(),
      rules
    }
  }).map(() => true);
}

export function setEnabled(rule, enabled) {
  return saveServiceRule(rule.setIn(['enabled'], enabled));
}

export function deleteServiceRule(id) {
  return http({
    method: 'DELETE',
    url: `/api/serviceExtractionConfigs/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createServiceRule({
  id,
  name,
  enabled,
  type,
  comment,
  matchSpecification,
  label,
  order,
  endpointRules
}) {
  return {
    id: id || generateUniqueShortId(),
    name: name || 'New Service Rule',
    enabled: enabled === undefined ? true : enabled,
    type: type || '',
    order: order || 0,
    comment: comment || '',
    matchSpecification: matchSpecification || {},
    endpointRules: endpointRules || [],
    extractSpecification: {
      label: label || 'Unnamed service'
    }
  };
}

export function createEndpointRule({ id, name, enabled, comment, matchSpecification, label }) {
  return {
    id: id || generateUniqueShortId(),
    name: name || 'New Endpoint',
    enabled: enabled === undefined ? true : enabled,
    comment: comment || '',
    matchSpecification: matchSpecification || {},
    extractSpecification: {
      label: label || 'Unnamed service endpoint'
    }
  };
}
