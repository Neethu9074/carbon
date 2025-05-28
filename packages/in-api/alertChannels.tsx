/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { fromJS } from 'immutable';
import { Map } from 'immutable';

import { AbstractIntegration, AbstractIntegrationUnion } from '@instana/types';
import { generateUniqueShortId } from '@instana/utils';

// @ts-expect-error TS migration
import { configs, fullyQualified } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/AlertChannels/configs';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';

export function getAlertChannelsInfosMutable(ids: string[] = []) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/alertingChannels/infos',
    queryParams: { ids }
  }).map(response => response.body);
}

export function getAlertChannel(id: string) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/events/settings/alertingChannels/${encodeURIComponent(id)}`,
    treat400AsError: false
  }).map(response => fromJS(response.body));
}

export function saveAlertChannel(
  integration: Map<keyof AbstractIntegrationUnion, AbstractIntegrationUnion[keyof AbstractIntegrationUnion]>,
  isCreate = false
) {
  const basePath = '/api/events/settings/alertingChannels';
  const method = isCreate ? 'POST' : 'PUT';
  const url = isCreate ? basePath : `${basePath}/${encodeURIComponent(integration.get('id'))}`;

  return http({
    method: method,
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: url,
    data: integration.toJS()
  }).map(response => fromJS(response.body));
}

export function deleteAlertChannel(id: string) {
  return http({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alertingChannels/${encodeURIComponent(id)}`
  }).map(response => fromJS(response.body));
}

export function alertChannelTest(
  integration: Map<keyof AbstractIntegrationUnion, AbstractIntegrationUnion[keyof AbstractIntegrationUnion]>
) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `/api/events/settings/alertingChannels/test`,
    data: integration.toJS()
  }).map(response => fromJS(response.body));
}

export function createAlertChannel(
  id: AbstractIntegration['id'] | null,
  kind: AbstractIntegration['kind'],
  name: AbstractIntegration['name'] = ''
) {
  if (!kind) {
    return {
      id: id || generateUniqueShortId(),
      kind: configs.email.name,
      name,
      rbacTags: [],
      emails: []
    };
  }

  kind = configs[kind].name;
  const integration = {
    id: id || generateUniqueShortId(),
    kind,
    name,
    rbacTags: []
  };

  fullyQualified[kind].enrichAlertChannelObject(integration);
  return integration;
}
