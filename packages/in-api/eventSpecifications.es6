import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getEventSpecificationsMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos'
  }).map(response => response.body);
}

export function getEventSpecifications(eventIds) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos',
    queryParams: {
      ids: eventIds ? eventIds : [],
      newApplicationModelEnabled: twoZeroModeEnabled
    }
  }).map(response => response.body);
}

export function getEventSpecificationByIds(eventIds) {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos',
    data: eventIds ? eventIds : [],
    queryParams: {
      newApplicationModelEnabled: twoZeroModeEnabled
    }
  }).map(response => response.body);
}

export function getBuiltInEventSpecification(id) {
  return getBuiltInEventSpecificationMutable(id).map(fromJS);
}

export function getBuiltInEventSpecificationMutable(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/built-in/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function getCustomEventSpecification(id) {
  return getCustomEventSpecificationMutable(id).map(fromJS);
}

export function getCustomEventSpecificationMutable(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(id)}`
  }).map(response => response.body);
}

export function createCustomSytemRuleBasedEventSpecification(
  id,
  name = 'New Event',
  entityType,
  query = '',
  triggering = false,
  description = '',
  expirationTime = null,
  enabled = true,
  ruleType = 'system',
  severity = 5,
  systemRuleId
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    entityType,
    query,
    triggering,
    description,
    expirationTime,
    enabled,
    rules: [
      {
        ruleType,
        systemRuleId,
        severity
      }
    ]
  };
}

export function createCustomThresholdBasedEventSpecification(
  id,
  name = 'New Event',
  entityType,
  query = '',
  triggering = false,
  description = '',
  expirationTime = null,
  enabled = true,
  ruleType = 'threshold',
  metricName,
  rollup,
  window,
  aggregation,
  conditionOperator,
  conditionValue,
  severity = 5
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    entityType,
    query,
    triggering,
    description,
    expirationTime,
    enabled,
    rules: [
      {
        ruleType,
        metricName,
        rollup,
        window,
        aggregation,
        conditionOperator,
        conditionValue,
        severity
      }
    ]
  };
}

export function saveCustomEventSpecification(event) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(event.id)}`,
    headers: getCsrfHeader(),
    data: event,
    queryParams: {
      newApplicationModelEnabled: twoZeroModeEnabled
    }
  }).map(response => fromJS(response.body));
}

export function setBuiltInEventSpecificationsEnabled(eventId, enabled) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url:
      `/api/events/settings/event-specifications/built-in/${encodeURIComponent(eventId)}/` +
      (enabled ? 'enable' : 'disable'),
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function setCustomEventSpecificationsEnabled(eventId, enabled) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url:
      `/api/events/settings/event-specifications/custom/${encodeURIComponent(eventId)}/` +
      (enabled ? 'enable' : 'disable'),
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function deleteCustomEventSpecification(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(id)}`,
    headers: getCsrfHeader()
  }).map(response => fromJS(response.body));
}
