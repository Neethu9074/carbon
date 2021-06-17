/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import {
  ruleTypeEntityVerification,
  ruleTypeHostAvailability
} from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEventFormDefinition';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { generateUniqueShortId } from 'in-services/util/id';
import http from 'in-services/http';
import { t } from 'in-i18n';

export function getEventSpecificationsMutable() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos'
  }).map(response => response.body);
}

export function getEventSpecifications(eventSpecificationIds) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos',
    queryParams: {
      ids: eventSpecificationIds ? eventSpecificationIds : []
    }
  }).map(response => response.body);
}

export function getEventSpecificationByIds(eventSpecificationIds) {
  return http({
    method: 'POST',
    headers: getCsrfHeader(),
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos',
    data: eventSpecificationIds ? eventSpecificationIds : []
  }).map(response => response.body);
}

export function getBuiltInEventSpecification(eventSpecificationIds) {
  return getBuiltInEventSpecificationMutable(eventSpecificationIds).map(fromJS);
}

export function getBuiltInEventSpecificationMutable(eventSpecificationIds) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/built-in/${encodeURIComponent(eventSpecificationIds)}`,
    treat400AsError: false
  }).map(response => response.body);
}

export function getCustomEventSpecification(eventSpecificationIds) {
  return getCustomEventSpecificationMutable(eventSpecificationIds).map(fromJS);
}

export function getCustomEventSpecificationMutable(eventSpecificationIds) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(eventSpecificationIds)}`,
    treat400AsError: false
  }).map(response => response.body);
}

export function createCustomSystemRuleBasedEventSpecificationForEntityVerification(
  id,
  name = t('in-settings:tabs.newEvent'),
  entityType,
  query = '',
  triggering = false,
  description = '',
  expirationTime = null,
  enabled = true,
  severity = 5,
  matchingEntityType,
  matchingOperator,
  matchingEntityLabel,
  offlineDuration,
  ruleType = ruleTypeEntityVerification
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
        severity,
        matchingEntityType,
        matchingOperator,
        matchingEntityLabel,
        offlineDuration
      }
    ]
  };
}

export function createCustomSystemRuleBasedHostAvailability(
  id,
  name = t('in-settings:tabs.newEvent'),
  triggering = false,
  description = '',
  expirationTime = null,
  tagFilter,
  offlineDuration,
  closeAfter,
  enabled = true,
  severity = 5
) {
  return {
    id: id || generateUniqueShortId(),
    name,
    entityType: 'host',
    triggering,
    description,
    expirationTime,
    enabled,
    rules: [
      {
        ruleType: ruleTypeHostAvailability,
        severity,
        offlineDuration,
        closeAfter,
        tagFilter
      }
    ]
  };
}

export function createCustomSystemRuleBasedEventSpecification(
  id,
  name = t('in-settings:tabs.newEvent'),
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
  name = t('in-settings:tabs.newEvent'),
  entityType,
  query = '',
  triggering = false,
  description = '',
  expirationTime = null,
  enabled = true,
  ruleType = 'threshold',
  metricName,
  metricPattern,
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
        metricPattern,
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

export function saveCustomEventSpecification(eventSpecification) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(eventSpecification.id)}`,
    headers: getCsrfHeader(),
    data: eventSpecification
  }).map(response => fromJS(response.body));
}

export function setBuiltInEventSpecificationsEnabled(eventSpecificationId, enabled) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/built-in/${encodeURIComponent(eventSpecificationId)}/${
      enabled ? 'enable' : 'disable'
    }`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function setCustomEventSpecificationsEnabled(eventSpecificationId, enabled) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(eventSpecificationId)}/${
      enabled ? 'enable' : 'disable'
    }`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function deleteCustomEventSpecification(eventSpecificationId) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(eventSpecificationId)}`,
    headers: getCsrfHeader()
  }).map(response => fromJS(response.body));
}
