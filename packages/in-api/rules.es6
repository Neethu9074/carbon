import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getRules() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/rules`,
    queryParams: {
      newApplicationModelEnabled: twoZeroModeEnabled
    }
  }).map(response => fromJS(response.body));
}

export function getSystemRules() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/rules/systemRules`
    // no need to make it immutable since it would be converted directly
  }).map(response => response.body);
}

export function getRule(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/rules/${encodeURIComponent(id)}`,
    queryParams: {
      newApplicationModelEnabled: twoZeroModeEnabled
    }
  }).map(response => fromJS(response.body));
}

export function saveRule(rule) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/rules/${encodeURIComponent(rule.get('id'))}`,
    headers: getCsrfHeader(),
    data: rule.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRule(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
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

export function isRuleDeprecated(rule) {
  if (!rule) {
    return false;
  }
  const flag = rule.get('deprecated', false);
  // if the deprecated flag is not present, the fallback value of entity.get will be false, but if it is present and
  // has value null we still need to convert null into false.
  return flag != null ? flag : false;
}

export function getRuleLabelWithDeprecationFlag(rule) {
  const flag = rule.get('deprecated');
  const name = rule.get('name');
  return twoZeroModeEnabled && flag ? name + ' (deprecated)' : name;
}

export function getBuiltInRules() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/built-in-rules`
  }).map(response => fromJS(response.body));
}

export function getBuiltInRule(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/settings/built-in-rules/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function setBuiltInRuleEnabled(rule, enabled) {
  return saveBuiltInRule(rule.set('enabled', enabled));
}

export function saveBuiltInRule(rule) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/settings/built-in-rules/${encodeURIComponent(rule.get('id'))}`,
    headers: getCsrfHeader(),
    data: rule.toJS()
  }).map(response => fromJS(response.body));
}
