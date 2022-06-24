/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fromJS, List, Map } from 'immutable';

import { Observable } from '@instana/observables';

import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { Action, Field, Mutable } from 'in-types';
import http from 'in-services/http';
import { t } from 'in-i18n';

const actionUrl = '/api/automation/settings/actions';

export function getAllActions(): Observable<Action[]> {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: actionUrl
  }).map(response => response.body);
}

export function getAction(actionId: string): Observable<Action> {
  return http<Action>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(actionId)}`
  }).map(response => fromJS(response.body));
}

export function saveNewAction(actionSpecification: NewAction) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: actionUrl,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

export function saveAction(actionSpecification: NewAction, id: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => fromJS(response.body));
}

export function deleteAction(actionId: string) {
  return http<Action>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${actionUrl}/${encodeURIComponent(actionId)}`
  }).map(response => fromJS(response.body));
}

export type NewAction = Mutable<Omit<Action, 'createdAt' | 'modifiedAt' | 'id'>>;
export type ImmutableNewAction = Map<string, string | string[] | List<Map<string, string>>>;

export const createDocLinkField = (value: string, description: string): Field => ({
  value,
  description,
  encoding: 'UTF8',
  name: 'URL'
});

export function createAction(
  name: string = t('in-settings:tabs.newAction'),
  type: string = 'doc_link',
  description: string = '',
  fields: Field[] = [createDocLinkField('', 'URL to remediation documentation')],
  tags: []
): ImmutableNewAction {
  return fromJS({
    name,
    type,
    description,
    fields,
    tags
  });
}
