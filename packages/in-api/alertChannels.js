/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';

import { generateUniqueShortId } from '@instana/utils';

import { configs, fullyQualified } from 'in-settings/tabs/TeamSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getAlertChannelsInfosMutable(ids = []) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/alertingChannels/infos',
    queryParams: { ids }
  }).map(response => response.body);
}

export function getAlertChannel(id) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/alertingChannels/${encodeURIComponent(id)}`,
    treat400AsError: false
  }).map(response => fromJS(response.body));
}

export function saveAlertChannel(integration) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alertingChannels/${encodeURIComponent(integration.get('id'))}`,
    data: integration.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteAlertChannel(id) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alertingChannels/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function alertChannelTest(integration) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alertingChannels/test/${encodeURIComponent(integration.get('id'))}`,
    data: integration.toJS()
  }).map(response => fromJS(response.body));
}

export function createAlertChannel(id, kind, name = '') {
  if (!kind) {
    return {
      id: id || generateUniqueShortId(),
      kind: configs.email.name,
      name,
      emails: []
    };
  }

  kind = configs[kind].name;
  const integration = {
    id: id || generateUniqueShortId(),
    kind,
    name
  };

  fullyQualified[kind].enrichAlertChannelObject(integration);
  return integration;
}
