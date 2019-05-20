import { deepCopy } from 'in-services/util/object';
import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getRuleBindings() {
  return getRuleBindingsMutable().map(fromJS);
}

export function getRuleBindingsMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/ruleBindings`
  }).map(response => response.body);
}

export function getRuleBinding(ruleBindingId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/ruleBindings/${encodeURIComponent(ruleBindingId)}`
  }).map(response => fromJS(response.body));
}

export function setEnabled(ruleBinding, enabled) {
  const copy = deepCopy(ruleBinding);
  copy.enabled = enabled;
  return saveRuleBindingMutable(copy);
}

export function saveRuleBindingMutable(ruleBinding) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/ruleBindings/${encodeURIComponent(ruleBinding.id)}`,
    data: ruleBinding
  }).map(response => response.body);
}

export function saveRuleBinding(ruleBinding) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/ruleBindings/${encodeURIComponent(ruleBinding.get('id'))}`,
    data: ruleBinding.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRuleBinding(ruleBindingId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/ruleBindings/${encodeURIComponent(ruleBindingId)}`
  }).map(response => fromJS(response.body));
}

export function createRuleBinding(
  id,
  enabled = true,
  triggering = false,
  severity = 0,
  text = 'Event Title',
  description = 'This is the Problem description. You can also use markdown here: \n * Relative change in value: **100%** \n * Confidence: **99.90%**',
  expirationTime = 60000,
  query = '',
  ruleIds = ['entity.offline']
) {
  return {
    id: id || generateUniqueShortId(),
    enabled,
    triggering,
    severity,
    text,
    description,
    expirationTime,
    query,
    ruleIds
  };
}
