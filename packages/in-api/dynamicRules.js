import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getDynamicRules() {
  return getDynamicRulesMutable().map(fromJS);
}

export function getDynamicRulesMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/alerts/anomaly`
  }).map(response => response.body);
}

export function getDynamicRule(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/alerts/anomaly/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function saveDynamicRule(rule) {
  return http({
    method: 'PUT',
    maxRetries: 1,
    url: `/api/alerts/anomaly/${encodeURIComponent(rule.id)}`,
    headers: getCsrfHeader(),
    data: rule
  }).map(response => fromJS(response.body));
}

export function deleteDynamicRule(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/alerts/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function createDynamicRule(
  id,
  name = 'New Rule',
  enabled = false,
  entityType = '',
  metricName = '',
  rollup = 1000,
  query = '',
  queryEvaluationTimestamp = Date.now(),
  ruleType = 'anomaly',
  sensitivity = 50,
  violationDirection = 'either',
  triggering = false,
  severity = 10,
  text = '',
  description = '',
  expirationTime = 1000 * 60 * 60,
  excludedSnapshotIds = []
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    enabled,
    match: {
      entityType,
      metricName,
      rollup,
      query,
      queryEvaluationTimestamp,
      excludedSnapshotIds
    },
    rule: {
      ruleType,
      sensitivity,
      violationDirection
    },
    event: {
      triggering,
      severity,
      text,
      description,
      expirationTime
    }
  };
}
