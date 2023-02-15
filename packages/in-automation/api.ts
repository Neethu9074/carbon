/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { combineLatest, just, Observable, timeout } from '@instana/observables';

import {
  Action,
  Field,
  VolatileId,
  Event,
  ActionMatch,
  EventSpecificationInfo,
  CustomEventSpecificationWithMetadata
} from 'in-types';
import { DOC_LINK_TYPE, HTTP_METHODS_WITH_BODY } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import createAgentResponseObservable from 'in-subscription/agentResponse';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
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

export type EventSpecification = EventSpecificationInfo | CustomEventSpecificationWithMetadata;
export function getScoredActionsForEvent(eventSpecification: EventSpecification) {
  return function(selectedActions: string[]) {
    if (selectedActions.length === 0) {
      return (alwaysEmptyArray as unknown) as Observable<Action[]>;
    }
    // null is treated as a pending result when converting the HTTP response into a result
    return getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '').map(actions =>
      actions.filter(action => selectedActions.indexOf(action.id) >= 0)
    );
  };
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
    encoding: 'base64',
    name: 'subtype',
    value: btoa('bash')
  },
  {
    value: btoa(value),
    description: 'script content',
    encoding: 'base64',
    name: 'script_ssh'
  }
];

export interface NoAuth {
  type: 'noAuth';
}

export interface BasicAuth {
  type: 'basicAuth';
  username: string;
  password: string;
}

export interface BearerAuth {
  type: 'bearerToken';
  bearerToken: string;
}
export interface ApiKeyAuth {
  type: 'apiKey';
  apiKey: string;
  apiKeyValue: string;
  apiKeyAddTo: string;
}
export type Authen = NoAuth | BasicAuth | BearerAuth | ApiKeyAuth;
export type AdditionalHeaders = { [k: string]: string };

interface WebhookFields {
  host: string;
  method: string;
  accept: string;
  acceptLanguage: string;
  contentType: string;
  additionalHeaders: AdditionalHeaders;
  body: string;
  authen: Authen;
  ignoreCertErrors: boolean;
}
export const createWebhookFields = ({
  host,
  method,
  accept,
  acceptLanguage,
  contentType,
  additionalHeaders,
  body,
  authen,
  ignoreCertErrors
}: WebhookFields): Field[] => [
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
      ...(accept ? { Accept: accept } : {}),
      ...(acceptLanguage ? { 'Accept-Language': acceptLanguage } : {}),
      ...(HTTP_METHODS_WITH_BODY.includes(method) && contentType ? { 'Content-Type': contentType } : {}),
      ...additionalHeaders
    }),
    description: 'header of the https request',
    encoding: 'ascii',
    name: 'header'
  },
  {
    name: 'ignoreCertErrors',
    value: ignoreCertErrors ? 'true' : 'false',
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
  name: string = t('in-automation:newAction'),
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

export interface ActionExecutionParameter {
  name: string;
  value: string;
}
interface RunActionBaseParams {
  volatileId: VolatileId;
  event: Event | undefined;
  actionName: string;
  inputParameters: ActionExecutionParameter[];
}

interface RunActionRequest {
  name: string;
  value: string;
  encoding: string;
}

interface RunActionParams extends RunActionBaseParams {
  type: string;
  request: RunActionRequest[];
}

interface RunScriptActionParams extends RunActionBaseParams {
  script: Field;
  interpreter: Field;
}

// We are using a timeout here to prevent the UI from hanging if the agent is not responding (sensor not installed).
function runAction({ volatileId, event, actionName, type, request, inputParameters }: RunActionParams) {
  return combineLatest(
    [
      timeout(10000).flatMap(() =>
        just(
          error<null>([
            {
              message: t('in-automation:actionSensorTimeout'),
              code: 'TIMEOUT'
            }
          ])
        )
      ),
      createAgentResponseObservable({
        action: 'action.run',
        target: volatileId,
        args: {
          type,
          inputParameters,
          async: 'true',
          event: JSON.stringify(event),
          eventId: event?.id,
          actionName,
          timeout: '300',
          request: request
        }
      })
    ],
    false
  );
}

export function runScriptAction({
  script,
  volatileId,
  event,
  actionName,
  interpreter,
  inputParameters
}: RunScriptActionParams) {
  return runAction({
    type: 'SCRIPT',
    volatileId,
    event,
    actionName,
    inputParameters,
    request: [
      {
        name: 'script_ssh',
        value: script.value,
        encoding: script.encoding
      },

      {
        name: 'subtype',
        value: interpreter.value,
        encoding: interpreter.encoding
      }
    ]
  });
}

interface RunWebhookActionParams extends RunActionBaseParams {
  method: Field;
  host: Field;
  body: Field;
  ignoreCertErrors: Field;
  header: Field;
  authen: Field;
}

export function runWebhookAction({
  volatileId,
  event,
  actionName,
  method,
  host,
  body,
  ignoreCertErrors,
  header,
  authen,
  inputParameters
}: RunWebhookActionParams) {
  return runAction({
    type: 'HTTP',
    volatileId,
    event,
    actionName,
    inputParameters,
    request: [
      {
        name: 'method',
        value: method.value,
        encoding: method.encoding
      },

      {
        name: 'host',
        value: host.value,
        encoding: host.encoding
      },

      {
        name: 'body',
        value: body.value,
        encoding: body.encoding
      },
      {
        name: 'ignoreCertErrors',
        value: ignoreCertErrors.value,
        encoding: ignoreCertErrors.encoding
      },
      {
        name: 'header',
        value: header.value,
        encoding: header.encoding
      },
      {
        name: 'authen',
        value: authen.value,
        encoding: authen.encoding
      }
    ]
  });
}
