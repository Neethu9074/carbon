import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';

export function getEventSpecificationsMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos'
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

export function createBuiltInEventSpecification() {
  if (__DEV__) {
    throw new Error('Built-in event specifications cannot be created.');
  }
  return {};
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

export function createCustomEventSpecification(
  id,
  name = 'New Event',
  enabled = true,
  match = {},
  rule = {},
  triggering = false,
  severity = 5,
  description = '',
  expirationTime = null,
  lastUpdated,
  downstream = {}
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    enabled,
    match,
    rule,
    event: {
      triggering,
      severity,
      description,
      expirationTime
    },
    downstream,
    lastUpdated
  };
}

export function saveCustomEventSpecification(event) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(event.get('id'))}`,
    headers: getCsrfHeader(),
    data: event.toJS()
  }).map(response => fromJS(response.body));
}
