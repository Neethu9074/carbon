/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fromJS } from 'immutable';

import { Observable } from '@instana/observables';

import {
  Action,
  Field,
  VolatileId,
  Event,
  ActionMatch,
  EventSpecificationInfo,
  CustomEventSpecificationWithMetadata,
  ActionAssociation,
  ActionAssociations,
  ApplicationAlertConfigWithMetadata,
  Result,
  ActionInstance
} from 'in-types';
import {
  ANSIBlE_TYPE,
  DOC_LINK_TYPE,
  HTTP_METHODS_WITH_BODY,
  SCRIPT_TYPE,
  WEBHOOK_TYPE,
  GITHUB_TYPE,
  GITLAB_TYPE,
  JIRA_TYPE
} from 'in-automation/ActionCatalog/shared';
import submitActionExecution from './subscriptions/submitActionExecution';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import createObservable from 'in-services/http/observableHttpResult';
import memoize from 'in-services/util/memoizingObservableGenerator';
import { alwaysEmptyArray } from 'in-services/fixedStreams';
import http from 'in-services/http';
import { t } from 'in-i18n';

const automationAPIBase = '/api/automation';
const actionUrl = `${automationAPIBase}/settings/actions` as const;
const actionAssociationsUrl = `${automationAPIBase}/settings/actions-associations` as const;
const resourceAssociationsUrl = `${automationAPIBase}/associations/v1` as const;

export function getAllActions(): Observable<Action[]> {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: actionUrl
  }).map(response => response.body);
}

export interface ScoredAction extends Action {
  score: number;
  confidence: string;
  aiEngine: string;
}

export const getAllActionsObservable = memoize(getAllActionsInternal, () => '', 1000);
export function getAllActionsInternal() {
  return createObservable(
    http<Action[]>({
      method: 'GET',
      maxRetries: 3,
      url: actionUrl
    }).map(response => response)
  );
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
  }).map(response =>
    response.body.map(({ action, score, confidence, aiEngine }) => ({ ...action, score, confidence, aiEngine }))
  );
}

export function getAction(actionId: string): Observable<Action> {
  return http<Action>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(actionId)}`
  }).map(response => response.body);
}

export function saveNewAction(actionSpecification: NewAction) {
  return http<Action>({
    method: 'POST',
    maxRetries: 3,
    url: actionUrl,
    headers: getCsrfHeader(),
    data: actionSpecification
  }).map(response => response.body);
}

export function saveAction(actionSpecification: NewAction, id: string) {
  return http<Action>({
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
export function getScoredActionsForEventOrAlert(
  selectedActions: string[],
  eventSpecification: EventSpecification | ApplicationAlertConfigWithMetadata
) {
  if (selectedActions.length === 0) {
    return alwaysEmptyArray as unknown as Observable<Action[]>;
  }
  // null is treated as a pending result when converting the HTTP response into a result
  return getAllActionsWithAISuggestions(eventSpecification.name, eventSpecification.description ?? '').map(actions =>
    actions.filter(action => selectedActions.indexOf(action.id) >= 0)
  );
}

interface getAllActionsWithAISuggestionsProps {
  eventName: string;
  eventDescription: string;
}

export const getAllActionsWithAISuggestionsInternalObservable: (
  args: getAllActionsWithAISuggestionsProps
) => Observable<Result<ScoredAction[]>> = memoize(
  getAllActionsWithAISuggestionsInternal,
  ({ eventName, eventDescription }) => eventName + eventDescription,
  1000
);

export function getAllActionsWithAISuggestionsInternal({
  eventName,
  eventDescription
}: getAllActionsWithAISuggestionsProps): Observable<Result<ScoredAction[]>> {
  return createObservable(
    http<ScoredAction[]>({
      method: 'POST',
      maxRetries: 3,
      url: `${automationAPIBase}/ai/action/match`,
      data: {
        name: eventName,
        description: eventDescription
      },
      headers: getCsrfHeader()
    })
  );
}

export type NewAction = Omit<Action, 'createdAt' | 'modifiedAt' | 'id'>;
export type NewActionAssociation = Omit<ActionAssociations, 'id'>;

export const createDocLinkField = (value: string): Field => ({
  value,
  description: 'URL to remediation documentation',
  encoding: 'UTF8',
  name: 'URL'
});

interface ScriptFields {
  value: string;
  subtype: string;
  timeout: string;
}

export const createScriptFields = ({ value, subtype, timeout }: ScriptFields): Field[] => [
  {
    value: btoa(subtype),
    description: 'script subtype',
    encoding: 'base64',
    name: 'subtype'
  },
  {
    value: btoa(value),
    description: 'script content',
    encoding: 'base64',
    name: 'script_ssh'
  },
  { ...createTimeoutField(timeout) }
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
  timeout: string;
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
  ignoreCertErrors,
  timeout
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
  },
  { ...createTimeoutField(timeout) }
];

export const createGithubFields = ({ owner, repo, ticketType }: GithubFields): Field[] => {
  // Extract ticketType properties.
  const { type, ...githubSpecificFields } = ticketType as TicketTypes;

  // Combine the fields.
  const mainFields: Field[] = [
    {
      value: owner,
      description: 'github issue owner/repo',
      encoding: 'ascii',
      name: 'owner'
    },
    {
      value: repo,
      description: 'github issue repo',
      encoding: 'ascii',
      name: 'repo'
    },
    {
      value: type,
      description: 'github issue type',
      encoding: 'ascii',
      name: 'ticketType'
    }
  ];

  // If type is 'open', combine the fields with the GithubOpenFields.
  if (type === 'open') {
    return [...mainFields, ...createGithubOpenFields(githubSpecificFields as GithubOpenFields)];
  } else if (type === 'close' || type === 'add_comment') {
    return [...mainFields, ...createGithubCloseAndCommentFields(githubSpecificFields as GithubCloseAndCommentFields)];
  }

  // Otherwise, just return the mainFields.
  return mainFields;
};

export const createGithubOpenFields = ({ title, body, labels, assignees }: GithubOpenFields): Field[] => [
  {
    value: title,
    description: 'github issue title',
    encoding: 'ascii',
    name: 'title'
  },
  {
    value: body,
    description: 'github issue body',
    encoding: 'ascii',
    name: 'body'
  },
  {
    value: labels,
    description: 'github issue labels',
    encoding: 'ascii',
    name: 'labels'
  },
  {
    value: assignees,
    description: 'github issue assignees',
    encoding: 'ascii',
    name: 'assignees'
  }
];

export const createGithubCloseAndCommentFields = ({ comment }: GithubCloseAndCommentFields): Field[] => [
  {
    value: comment,
    description: 'github issue comment',
    encoding: 'ascii',
    name: 'comment'
  }
];

interface GitlabFields {
  projectId: string;
  ticketType: TicketTypes | null;
}

interface GitlabOpenFields {
  title: string;
  gitlab_description: string;
  labels: string;
  issue_type: string;
}

export const createGitlabFields = ({ projectId, ticketType }: GitlabFields): Field[] => {
  // Extract ticketType properties.
  const { type, ...githubSpecificFields } = ticketType as TicketTypes;

  // Combine the fields.
  const mainFields: Field[] = [
    {
      value: projectId,
      description: 'gitlab projectId',
      encoding: 'ascii',
      name: 'projectId'
    },
    {
      value: type,
      description: 'gitlab ticket type',
      encoding: 'ascii',
      name: 'ticketType'
    }
  ];

  // If type is 'open', combine the fields with the GithubOpenFields.
  if (type === 'open') {
    return [...mainFields, ...createGitlabOpenFields(githubSpecificFields as GitlabOpenFields)];
  } else if (type === 'close' || type === 'add_comment') {
    return [...mainFields, ...createGithubCloseAndCommentFields(githubSpecificFields as GithubCloseAndCommentFields)];
  }

  // Otherwise, just return the mainFields.
  return mainFields;
};

export const createGitlabOpenFields = ({
  title,
  gitlab_description,
  labels,
  issue_type
}: GitlabOpenFields): Field[] => [
  {
    value: title,
    description: 'gitlab issue title',
    encoding: 'ascii',
    name: 'title'
  },
  {
    value: gitlab_description,
    description: 'gitlab issue description',
    encoding: 'ascii',
    name: 'gitlab_description'
  },
  {
    value: labels,
    description: 'github issue labels',
    encoding: 'ascii',
    name: 'labels'
  },
  {
    value: issue_type,
    description: 'gitlab issue type',
    encoding: 'ascii',
    name: 'issue_type'
  }
];

interface JiraFields {
  project: string;
  ticketType: TicketTypes | null;
}

interface JiraOpenFields {
  summary: string;
  assignee: string;
  jira_description: string;
  labels: string;
  issue_type: string;
}

export const createJiraFields = ({ project, ticketType }: JiraFields): Field[] => {
  // Extract ticketType properties.
  const { type, ...githubSpecificFields } = ticketType as TicketTypes;

  // Combine the fields.
  const mainFields: Field[] = [
    {
      value: project,
      description: 'jira project',
      encoding: 'ascii',
      name: 'project'
    },
    {
      value: type,
      description: 'jira ticket type',
      encoding: 'ascii',
      name: 'ticketType'
    }
  ];

  // If type is 'open', combine the fields with the GithubOpenFields.
  if (type === 'open') {
    return [...mainFields, ...createJiraOpenFields(githubSpecificFields as JiraOpenFields)];
  } else if (type === 'close' || type === 'add_comment') {
    return [...mainFields, ...createGithubCloseAndCommentFields(githubSpecificFields as GithubCloseAndCommentFields)];
  }

  // Otherwise, just return the mainFields.
  return mainFields;
};

export const createJiraOpenFields = ({
  summary,
  jira_description,
  assignee,
  labels,
  issue_type
}: JiraOpenFields): Field[] => [
  {
    value: summary,
    description: 'jira issue summary',
    encoding: 'ascii',
    name: 'summary'
  },
  {
    value: jira_description,
    description: 'jira issue description',
    encoding: 'ascii',
    name: 'jira_description'
  },
  {
    value: assignee,
    description: 'jira issue assignee',
    encoding: 'ascii',
    name: 'assignee'
  },
  {
    value: labels,
    description: 'github issue labels',
    encoding: 'ascii',
    name: 'labels'
  },
  {
    value: issue_type,
    description: 'gitlab issue type',
    encoding: 'ascii',
    name: 'issue_type'
  }
];

interface GithubFields {
  owner: string;
  repo: string;
  ticketType: TicketTypes | null;
}

interface GithubOpenFields {
  title: string;
  body: string;
  labels: string;
  assignees: string;
}

interface GithubCloseAndCommentFields {
  comment: string;
}
export interface OpenProps {
  type: 'open';
  title: string;
  body: string;
  labels: string;
  assignees: string;
}

export interface OpenGLProps {
  type: 'open';
  title: string;
  gitlab_description: string;
  labels: string;
  issue_type: string;
}

export interface OpenJiraProps {
  type: 'open';
  summary: string;
  jira_description: string;
  assignee: string;
  labels: string;
  issue_type: string;
}

export interface CloseProps {
  type: 'close';
  comment: string;
}
export interface CommentProps {
  type: 'add_comment';
  comment: string;
}
export type TicketTypes = OpenProps | CloseProps | CommentProps | OpenGLProps | OpenJiraProps;

const createTimeoutField = (value: string): Field => ({
  value,
  description: 'timeout of the action execution in seconds',
  encoding: 'ascii',
  name: 'timeout'
});

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
  actionId: string;
  inputParameters: ActionExecutionParameter[];
  timeout: string;
  hostsLimit?: string;
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
function runAction({
  volatileId,
  event,
  actionName,
  type,
  request,
  inputParameters,
  actionId,
  timeout,
  hostsLimit
}: RunActionParams) {
  return submitActionExecution({
    action: 'action.run',
    target: volatileId,
    args: {
      type,
      hostsLimit,
      inputParameters,
      async: 'true',
      event: JSON.stringify(event),
      eventId: event?.id,
      actionName,
      actionId,
      timeout: timeout === '' ? null : timeout,
      request: request
    }
  });
}

export function runScriptAction({
  script,
  volatileId,
  event,
  actionName,
  actionId,
  interpreter,
  inputParameters,
  timeout
}: RunScriptActionParams) {
  return runAction({
    type: SCRIPT_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
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
  actionId,
  method,
  host,
  body,
  ignoreCertErrors,
  header,
  authen,
  inputParameters,
  timeout
}: RunWebhookActionParams) {
  return runAction({
    type: WEBHOOK_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
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

interface RunWebhookActionParams extends RunActionBaseParams {
  method: Field;
  host: Field;
  body: Field;
  ignoreCertErrors: Field;
  header: Field;
  authen: Field;
}

interface RunGithubOpenActionParams extends RunActionBaseParams {
  owner: Field;
  repo: Field;
  ticketType: Field;
  title: Field;
  body: Field;
  labels: Field;
  assignees: Field;
}

export function runGithubOpenAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  owner,
  repo,
  ticketType,
  title,
  body,
  labels,
  assignees
}: RunGithubOpenActionParams) {
  return runAction({
    type: GITHUB_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    request: [
      {
        name: 'owner',
        value: owner.value,
        encoding: owner.encoding
      },
      {
        name: 'repo',
        value: repo.value,
        encoding: repo.encoding
      },

      {
        name: 'ticketActionType',
        value: ticketType.value,
        encoding: ticketType.encoding
      },
      {
        name: 'title',
        value: title.value,
        encoding: title.encoding
      },
      {
        name: 'body',
        value: body.value,
        encoding: body.encoding
      },
      {
        name: 'labels',
        value: labels.value,
        encoding: labels.encoding
      },
      {
        name: 'assignees',
        value: assignees.value,
        encoding: assignees.encoding
      }
    ]
  });
}

interface RunGithubCloseActionParams extends RunActionBaseParams {
  owner: Field;
  repo: Field;
  ticketType: Field;
  comment: Field;
}

export function runGithubCloseAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  owner,
  repo,
  ticketType,
  comment
}: RunGithubCloseActionParams) {
  return runAction({
    type: GITHUB_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    request: [
      {
        name: 'owner',
        value: owner.value,
        encoding: owner.encoding
      },

      {
        name: 'repo',
        value: repo.value,
        encoding: repo.encoding
      },
      {
        name: 'ticketActionType',
        value: ticketType.value,
        encoding: ticketType.encoding
      },
      {
        name: 'comment',
        value: comment.value,
        encoding: comment.encoding
      }
    ]
  });
}

interface RunGitlabOpenActionParams extends RunActionBaseParams {
  ticketType: Field;
  projectId: Field;
  title: Field;
  body: Field;
  labels: Field;
  issue_type: Field;
}

export function runGitlabOpenAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  projectId,
  ticketType,
  title,
  body,
  labels,
  issue_type
}: RunGitlabOpenActionParams) {
  return runAction({
    type: GITLAB_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    request: [
      {
        name: 'projectId',
        value: projectId.value,
        encoding: projectId.encoding
      },

      {
        name: 'ticketActionType',
        value: ticketType.value,
        encoding: ticketType.encoding
      },
      {
        name: 'title',
        value: title.value,
        encoding: title.encoding
      },
      {
        name: 'body',
        value: body.value,
        encoding: body.encoding
      },
      {
        name: 'labels',
        value: labels.value,
        encoding: labels.encoding
      },
      {
        name: 'issue_type',
        value: issue_type.value,
        encoding: issue_type.encoding
      }
    ]
  });
}

interface RunGitlabCloseActionParams extends RunActionBaseParams {
  projectId: Field;
  ticketType: Field;
  comment: Field;
}

export function runGitlabCloseAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  projectId,
  ticketType,
  comment
}: RunGitlabCloseActionParams) {
  return runAction({
    type: GITLAB_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    request: [
      {
        name: 'projectId',
        value: projectId.value,
        encoding: projectId.encoding
      },
      {
        name: 'ticketActionType',
        value: ticketType.value,
        encoding: ticketType.encoding
      },
      {
        name: 'comment',
        value: comment.value,
        encoding: comment.encoding
      }
    ]
  });
}

interface RunJiraOpenActionParams extends RunActionBaseParams {
  ticketType: Field;
  project: Field;
  summary: Field;
  assignee: Field;
  body: Field;
  labels: Field;
  issue_type: Field;
}

export function runJiraOpenAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  project,
  ticketType,
  summary,
  assignee,
  body,
  labels,
  issue_type
}: RunJiraOpenActionParams) {
  return runAction({
    type: JIRA_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    request: [
      {
        name: 'project',
        value: project.value,
        encoding: project.encoding
      },

      {
        name: 'ticketActionType',
        value: ticketType.value,
        encoding: ticketType.encoding
      },
      {
        name: 'summary',
        value: summary.value,
        encoding: summary.encoding
      },
      {
        name: 'assignee',
        value: assignee.value,
        encoding: assignee.encoding
      },
      {
        name: 'body',
        value: body.value,
        encoding: body.encoding
      },
      {
        name: 'labels',
        value: labels.value,
        encoding: labels.encoding
      },
      {
        name: 'issue_type',
        value: issue_type.value,
        encoding: issue_type.encoding
      }
    ]
  });
}

interface RunJiraCloseActionParams extends RunActionBaseParams {
  project: Field;
  ticketType: Field;
  comment: Field;
}

export function runJiraCloseAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  project,
  ticketType,
  comment
}: RunJiraCloseActionParams) {
  return runAction({
    type: JIRA_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    request: [
      {
        name: 'project',
        value: project.value,
        encoding: project.encoding
      },
      {
        name: 'ticketActionType',
        value: ticketType.value,
        encoding: ticketType.encoding
      },
      {
        name: 'comment',
        value: comment.value,
        encoding: comment.encoding
      }
    ]
  });
}

interface RunAnsibleActionParams extends RunActionBaseParams {
  playbookId: Field;
  playbookFileName: Field;
  ansibleUrl: Field;
  jobTemplateUrl: string;
  hostsLimit: string;
}

export function runAnsibleAction({
  volatileId,
  event,
  actionName,
  actionId,
  playbookId,
  playbookFileName,
  ansibleUrl,
  jobTemplateUrl,
  inputParameters,
  timeout,
  hostsLimit
}: RunAnsibleActionParams) {
  return runAction({
    type: ANSIBlE_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    hostsLimit,
    request: [
      {
        name: 'playbookId',
        value: playbookId.value,
        encoding: playbookId.encoding
      },

      {
        name: 'playbookFileName',
        value: playbookFileName.value,
        encoding: playbookFileName.encoding
      },

      {
        name: 'ansibleUrl',
        value: ansibleUrl.value,
        encoding: ansibleUrl.encoding
      },
      {
        name: 'jobTemplateUrl',
        value: jobTemplateUrl,
        encoding: 'ascii'
      }
    ]
  });
}

export type DynamicParamValue = {
  name: string;
  key?: string;
  tagName: string;
};

export type ResolvedDynamicParamValue = DynamicParamValue & {
  resolvedValue: string;
};

export function resolveDynamicParameters(eventId: string, parameters: DynamicParamValue[], timestamp: number) {
  return http<{
    parameters: ResolvedDynamicParamValue[];
  }>({
    method: 'PUT',
    maxRetries: 3,
    url: `${automationAPIBase}/parameters/dynamic`,
    headers: getCsrfHeader(),
    mapToResultObject: true,
    data: {
      eventId,
      parameters,
      timestamp
    }
  });
}

interface UpdateActionParams {
  id: string;
  feedback: number;
  to: number;
  windowSize: number;
  comment: string;
}

export function updateActionInstanceFeedback({ id, feedback, to, windowSize, comment }: UpdateActionParams) {
  return http<ActionInstance>({
    method: 'PUT',
    maxRetries: 3,
    url: `${automationAPIBase}/actioninstances/${encodeURIComponent(id)}/feedback`,
    data: {
      feedback: feedback + '',
      comment: comment || ''
    },
    headers: getCsrfHeader(),
    queryParams: {
      to,
      windowSize
    }
  }).map(response => response.body);
}

export function updateActionResourceAssociations(data: NewActionAssociation) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: actionAssociationsUrl,
    headers: getCsrfHeader(),
    data: data
  }).map(response => response.body);
}

export function getActionResourceAssociations(actionId: string) {
  return http<ActionAssociation[]>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionAssociationsUrl}?action_id=${encodeURIComponent(actionId)}`,
    headers: getCsrfHeader()
  }).map(response => response.body);
}

export function updateApplicationAlertActionAssociations(actionIds: string[], applicationAlertId: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${resourceAssociationsUrl}/application-alert-configs/${encodeURIComponent(applicationAlertId)}/actions`,
    headers: getCsrfHeader(),
    data: actionIds
  }).map(response => fromJS(response.body));
}

export function updateBuiltinEventActionAssociations(actionIds: string[], builtinEventId: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${resourceAssociationsUrl}/builtin-events/${encodeURIComponent(builtinEventId)}/actions`,
    headers: getCsrfHeader(),
    data: actionIds
  }).map(response => fromJS(response.body));
}

export function getBuiltinEventActionAssociations(builtinEventId: string) {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionAssociationsUrl}?builtin_event_id=${encodeURIComponent(builtinEventId)}`,
    treat400AsError: false
  }).map(response => response.body);
}

export function updateCustomEventActionAssociations(actionIds: string[], customEventId: string) {
  return http({
    method: 'PUT',
    maxRetries: 3,
    url: `${resourceAssociationsUrl}/custom-events/${encodeURIComponent(customEventId)}/actions`,
    headers: getCsrfHeader(),
    data: actionIds
  }).map(response => fromJS(response.body));
}

export function getCustomEventActionAssociations(customEventId: string) {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionAssociationsUrl}?custom_event_id=${encodeURIComponent(customEventId)}`,
    treat400AsError: false
  }).map(response => response.body);
}

function getApplicationAlertActionAssociationsRequest(id: string) {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${automationAPIBase}/settings/actions-associations?application_alert_id=${encodeURIComponent(id)}`
  });
}

export function getApplicationAlertActionAssociations(id: string): Observable<Action[]> {
  const request = getApplicationAlertActionAssociationsRequest(id);
  return request.map(response => response.body);
}

export function getApplicationAlertActionAssociationsWithResult(id: string): Observable<Result<Action[]>> {
  const request = getApplicationAlertActionAssociationsRequest(id);
  return createObservable(request);
}
