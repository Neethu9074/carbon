import { fromJS } from 'immutable';

import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getRules() {
  return http({
    method: 'GET',
    url: `/api/rules`
  }).map(response => fromJS(response.body));
}

export function getRule(id) {
  return http({
    method: 'GET',
    url: `/api/rules/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function saveRule(rule) {
  return http({
    method: 'PUT',
    url: `/api/rules/${encodeURIComponent(rule.get('id'))}`,
    data: rule.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRule(id) {
  return http({
    method: 'DELETE',
    url: `/api/rules/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createRule(
  id,
  name = 'New Rule',
  entityType = '',
  metricName = '',
  rollup = 1000,
  window = 1000,
  aggregation = '',
  conditionOperator = '',
  conditionValue = 0.0
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    entityType,
    metricName,
    rollup,
    window,
    aggregation,
    conditionOperator,
    conditionValue
  };
}
