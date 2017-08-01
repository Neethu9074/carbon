import { fromJS } from 'immutable';

import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getRuleBindings() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/ruleBindings`
  }).map(response => fromJS(response.body));
}

export function getRuleBinding(ruleBindingId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/ruleBindings/${encodeURIComponent(ruleBindingId)}`
  }).map(response => fromJS(response.body));
}

export function setEnabled(ruleBinding, enabled) {
  return saveRuleBinding(ruleBinding.setIn(['enabled'], enabled));
}

export function saveRuleBinding(ruleBinding) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/ruleBindings/${encodeURIComponent(ruleBinding.get('id'))}`,
    data: ruleBinding.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteRuleBinding(ruleBindingId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
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
  ruleIds = []
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
