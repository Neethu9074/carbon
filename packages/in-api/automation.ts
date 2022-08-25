/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fromJS, Map } from 'immutable';

import { Observable } from '@instana/observables';

import { Action, Field, Mutable, VolatileId, ActionAIScore, Event } from 'in-types';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import http from 'in-services/http';
import { t } from 'in-i18n';

const automationAPIBase = '/api/automation';
const actionUrl = `${automationAPIBase}/settings/actions`;

export function getAllActions(): Observable<Action[]> {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: actionUrl
  }).map(response => response.body);
}

export function getAllActionsWithAISuggestions(
  eventName: string,
  eventDescription: string
): Observable<ActionAIScore[]> {
  return http<ActionAIScore[]>({
    method: 'POST',
    maxRetries: 3,
    url: `${automationAPIBase}/ai/action/match`,
    data: {
      name: eventName,
      description: eventDescription,
      type: 'nlp',
      tags: ['host, database', 'performance'],
      searchOrder: 'name'
    },
    headers: getCsrfHeader()
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

export type ImmutableNewAction = Map<string, unknown>;

export const createDocLinkField = (value: string): Field => ({
  value,
  description: 'URL to remediation documentation',
  encoding: 'UTF8',
  name: 'URL'
});

export const createScriptFields = (value: string): Field[] => [
  {
    description: 'script subtype',
    encoding: 'ascii',
    name: 'subtype',
    value: 'bash'
  },
  {
    value: btoa(value),
    description: 'script content',
    encoding: 'base64',
    name: 'script_ssh'
  }
];

export function createAction(
  name: string = t('in-settings:tabs.newAction'),
  type: string = 'doc_link',
  description: string = '',
  fields: Field[] = [createDocLinkField('')],
  tags: string[] = []
): ImmutableNewAction {
  return fromJS({
    name,
    type,
    description,
    fields,
    tags
  });
}

export function runScriptAction(script: string, volatileId: VolatileId, event: Event | null) {
  return createAgentResponseObservable({
    action: 'action.run',
    target: volatileId,
    args: {
      actionType: 'SCRIPT',
      command: script,
      async: 'true',
      actionOperation: 'action.run',
      event
    }
  });
}
