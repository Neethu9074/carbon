/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fromJS } from 'immutable';

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Action, Result } from 'in-types';
import http from 'in-services/http';
import { t } from 'in-i18n';

export function getAllActions(): Observable<Action[]> {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/automation/settings/actions'
  }).map(response => response.body);
}

export function getAction(actionId: string): Observable<Result<Action>> {
  return http<Action>({
    method: 'GET',
    maxRetries: 3,
    url: `/api/automation/settings/actions/${encodeURIComponent(actionId)}`,
    mapToResultObject: true
  });
}

// TODO
export function saveNewAction(actionSpecification: any) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: '/api/automation/settings/actions',
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

// TODO
export function saveAction(actionSpecification: any) {
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
