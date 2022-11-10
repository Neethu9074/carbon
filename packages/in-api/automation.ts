/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { combineLatest, just, Observable, timeout } from '@instana/observables';

import { DOC_LINK_TYPE } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import { Action, Field, VolatileId, Event, ActionMatch } from 'in-types';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { error } from 'in-services/util/result';
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

export interface ScoredAction extends Action {
  score: number;
  color: string;
}

export function getAllActionsWithAISuggestions(
  eventName: string,
  eventDescription: string
): Observable<ScoredAction[]> {
  return http<ActionMatch[]>({
    method: 'POST',
    maxRetries: 3,
    url: `${automationAPIBase}/ai/action/match`,
    data: {
      name: eventName,
      description: eventDescription
    },
    headers: getCsrfHeader()
  }).map(response => response.body.map(({ action, score, color }) => ({ ...action, score, color })));
}

export function getAction(actionId: string): Observable<Action> {
  return http<Action>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(actionId)}`
  }).map(response => response.body);
}

export function saveNewAction(actionSpecification: NewAction) {
  return http({
    method: 'POST',
    maxRetries: 3,
    url: actionUrl,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => response.body);
}

export function saveAction(actionSpecification: NewAction, id: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => response.body);
}

export function deleteAction(actionId: string) {
  return http<Action>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${actionUrl}/${encodeURIComponent(actionId)}`
  }).map(response => response.body);
}

export type NewAction = Omit<Action, 'createdAt' | 'modifiedAt' | 'id'>;

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

export type Authen = {
  type: 'none' | 'basicAuth' | 'bearerToken' | 'apiKey';
  username?: string;
  password?: string;
  bearerToken?: string;
  apiKey?: string;
  apiKeyValue?: string;
  apiKeyAddTo?: string;
};

export type AdditionalHeaders = { [k: string]: string };
export const createWebhookFields = ({
  host,
  method,
  accept,
  acceptLanguage,
  contentType,
  additionalHeaders,
  body,
  authen
}: {
  host: string;
  method: string;
  username: string;
  password: string;
  accept: string;
  acceptLanguage: string;
  contentType: string;
  additionalHeaders: AdditionalHeaders;
  body: string;
  authen: Authen;
}): Field[] => [
  {
    description: 'method of the https request',
    encoding: 'ascii',
    name: 'method',
    value: method
  },
  {
    value: host,
    description: 'url of the https request',
    encoding: 'ascii',
    name: 'host'
  },
  {
    value: JSON.stringify({
      Accept: accept,
      'Accept-Language': acceptLanguage,
      'Content-Type': contentType,
      ...additionalHeaders
    }),
    description: 'header of the https request',
    encoding: 'ascii',
    name: 'header'
  },
  {
    name: 'ignoreCertErrors',
    value: 'true',
    encoding: 'ascii',
    description: 'ignore certificate errors for request'
  },
  {
    value: JSON.stringify(authen),
    description: 'authen of the https request',
    encoding: 'ascii',
    name: 'authen'
  },
  {
    value: body,
    description: 'body of the https request',
    encoding: 'ascii',
    name: 'body'
  }
];

export function createAction(
  name: string = t('in-settings:tabs.newAction'),
  type: string = DOC_LINK_TYPE,
  description: string = '',
  fields: Field[] = [createDocLinkField('')],
  tags: string[] = []
): NewAction {
  return {
    name,
    type,
    description,
    fields,
    tags
  };
}

// We are using a timeout here to prevent the UI from hanging if the agent is not responding (sensor not installed).
export function runScriptAction(
  script: string,
  volatileId: VolatileId,
  event: Event | null,
  actionName: string,
  interpreter: string
) {
  return combineLatest(
    [
      timeout(10000).flatMap(() =>
        just(
          error<null>([
            {
              message: t('in-events:actionSensorTimeout'),
              code: 'TIMEOUT'
            }
          ])
        )
      ),
      createAgentResponseObservable({
        action: 'action.run',
        target: volatileId,
        args: {
          type: 'SCRIPT',
          async: 'true',
          event: JSON.stringify(event),
          problemId: event?.problem?.id,
          problemText: event?.problem?.problemText,
          actionName,
          timeout: '300',
          request: [
            {
              name: 'script',
              value: script,
              encoded: 'base64'
            },

            {
              name: 'interpreter',
              value: interpreter,
              encoded: 'base64'
            }
          ]
        }
      })
    ],
    false
  );
}

export function runWebhookAction(
  volatileId: VolatileId,
  event: Event | null,
  actionName: string,
  method: string,
  host: string,
  body: string,
  ignoreCertErrors: string,
  header: string
) {
  return createAgentResponseObservable({
    action: 'action.run',
    target: volatileId,
    args: {
      type: 'HTTP',
      async: 'true',
      event: JSON.stringify(event),
      problemId: event?.problem?.id,
      problemText: event?.problem?.problemText,
      actionName,
      timeout: '300',
      request: [
        {
          name: 'method',
          value: method,
          encoded: 'ascii'
        },

        {
          name: 'host',
          value: host,
          encoded: 'base64'
        },

        {
          name: 'body',
          value: body,
          encoding: 'base64'
        },
        {
          name: 'ignoreCertErrors',
          value: ignoreCertErrors,
          encoding: 'ascii'
        },
        {
          name: 'header',
          value: header,
          encoding: 'base64'
        }
      ]
    }
  });
}
