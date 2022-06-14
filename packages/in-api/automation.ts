/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fromJS } from 'immutable';

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Action, Field, Result, Mutable } from 'in-types';
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

export function saveNewAction(actionSpecification: NewAction) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: '/api/automation/settings/actions',
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

export function saveAction(actionSpecification: Action) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `/api/automation/settings/actions/${encodeURIComponent(actionSpecification.id)}`,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

export type NewAction = Mutable<Omit<Action, 'createdAt' | 'modifiedAt' | 'id'>>;

export function createAction(
  name: string = t('in-settings:tabs.newAction'),
  type: string = 'doc_link',
  description: string = '',
  fields: Field[] = [{ description: 'URL to remediation documentation', encoding: 'UTF8', name: 'URL', value: '' }]
): NewAction {
  return {
    name,
    type,
    description,
    fields
  };
}
