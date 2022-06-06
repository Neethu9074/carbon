/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fromJS } from 'immutable';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';
import { t } from 'in-i18n';

export function getAllActions() {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: '/api/automation/settings/actions'
  }).map(response => response.body);
}

export function getAction(actionId) {
  return http({
    method: 'GET',
    maxRetries: 3,
    url: `/api/automation/settings/actions/${encodeURIComponent(actionId)}`,
    treat400AsError: false
  }).map(response => response.body);
}

export function saveNewAction(actionSpecification) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: '/api/automation/settings/actions',
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

export function saveAction(actionSpecification) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/automation/settings/actions/${encodeURIComponent(actionSpecification.id)}`,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

export function createAction(
  name = t('in-settings:tabs.newAction'),
  type = 'doc_link',
  description = '',
  fields = [{ description: 'URL to remediation documentation', encoding: 'UTF8', name: 'URL', value: '' }]
) {
  return {
    name,
    type,
    description,
    fields
  };
}
