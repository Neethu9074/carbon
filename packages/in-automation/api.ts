/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';

import {
  Action,
  Field,
  VolatileId,
  Event,
  ActionMatch,
  EventSpecificationInfo,
  ApplicationAlertConfigWithMetadata,
  ActionInstance,
  Policy,
  TagCatalog,
  ParameterValue,
  GetDynamicParameterValues,
  TriggerType,
  WebsiteAlertConfigWithMetadata,
  MobileAppAlertConfigWithMetadata,
  InfraAlertConfigWithMetadata,
  LogAlertConfigWithMetadata,
  GlobalApplicationsAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata
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
import turboSubmitActionExecution from 'in-automation/subscriptions/turboSubmitActionExecution';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import submitActionExecution from 'in-automation/subscriptions/submitActionExecution';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { NewPolicy } from 'in-automation/Policies/types';
import { mapData } from 'in-services/util/result';
import http from 'in-services/http';
import { t } from 'in-i18n';

const automationAPIBase = '/api/automation';
const actionUrl = `${automationAPIBase}/actions` as const;
const policiesUrl = `${automationAPIBase}/policies` as const;

export function getActions() {
  return http<Action[]>({
    method: 'GET',
    maxRetries: 3,
    url: actionUrl,
    mapToResultObject: true
  });
}

export interface ScoredAction extends Action {
  score: number;
  confidence: string;
  aiEngine: string;
}

export function getAllActionsWithAISuggestions(name: string, description: string, targetSnapshotId?: string) {
  return http<ActionMatch[]>({
    method: 'POST',
    maxRetries: 3,
    url: `${automationAPIBase}/ai/action/match${
      targetSnapshotId ? `?targetSnapshotId=${encodeURIComponent(targetSnapshotId)}` : ''
    }`,
    data: {
      name,
      description
    },
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(response =>
    mapData(response, actions =>
      actions.map(({ action, score, confidence, aiEngine }) => ({ ...action, score, confidence, aiEngine }))
    )
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

export type NewAction = Omit<Action, 'createdAt' | 'modifiedAt' | 'id'>;

export const createDocLinkField = (value: string): Field => ({
  value,
  description: 'URL to remediation documentation',
  encoding: 'UTF8',
  name: 'URL'
});

export const createManualField = (value: string): Field => ({
  value: btoa(value),
  description: 'Content for manual action',
  encoding: 'base64',
  name: 'content'
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

export const createGithubFields = ({ owner, repo, ticketActionType }: GithubFields): Field[] => {
  // Extract ticketActionType properties.
  const { type, ...githubSpecificFields } = ticketActionType as TicketTypes;

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
      name: 'ticketActionType'
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
  ticketActionType: TicketTypes | null;
}

interface GitlabOpenFields {
  title: string;
  body: string;
  labels: string;
  issue_type: string;
}

export const createGitlabFields = ({ projectId, ticketActionType }: GitlabFields): Field[] => {
  // Extract ticketActionType properties.
  const { type, ...githubSpecificFields } = ticketActionType as TicketTypes;

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
      name: 'ticketActionType'
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

export const createGitlabOpenFields = ({ title, body, labels, issue_type }: GitlabOpenFields): Field[] => [
  {
    value: title,
    description: 'gitlab issue title',
    encoding: 'ascii',
    name: 'title'
  },
  {
    value: body,
    description: 'gitlab issue description',
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
    value: issue_type,
    description: 'gitlab issue type',
    encoding: 'ascii',
    name: 'issue_type'
  }
];

interface JiraFields {
  project: string;
  ticketActionType: TicketTypes | null;
}

interface JiraOpenFields {
  summary: string;
  assignee: string;
  body: string;
  labels: string;
  issue_type: string;
}

export const createJiraFields = ({ project, ticketActionType }: JiraFields): Field[] => {
  // Extract ticketActionType properties.
  const { type, ...githubSpecificFields } = ticketActionType as TicketTypes;

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
      name: 'ticketActionType'
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

export const createJiraOpenFields = ({ summary, body, assignee, labels, issue_type }: JiraOpenFields): Field[] => [
  {
    value: summary,
    description: 'jira issue summary',
    encoding: 'ascii',
    name: 'summary'
  },
  {
    value: body,
    description: 'jira issue description',
    encoding: 'ascii',
    name: 'body'
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
  ticketActionType: TicketTypes | null;
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
  body: string;
  labels: string;
  issue_type: string;
}

export interface OpenJiraProps {
  type: 'open';
  summary: string;
  body: string;
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

interface RunActionBaseParams {
  volatileId: VolatileId;
  event: Event | undefined;
  actionName: string;
  actionId: string;
  inputParameters: ParameterValue[];
  timeout: string;
  hostsLimit?: string;
  policyId: string;
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
  hostsLimit,
  policyId
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
      request: request,
      policyId: policyId === '' ? null : policyId
    }
  });
}

interface RunActionBaseParams {
  volatileId: VolatileId;
  event: Event | undefined;
  actionName: string;
  actionId: string;
  inputParameters: ParameterValue[];
  timeout: string;
  hostsLimit?: string;
  policyId: string;
}

interface RunActionRequest {
  name: string;
  value: string;
  encoding: string;
}

interface RunTurboActionParams {
  volatileId: VolatileId;
  event: Event | undefined;
  actionName: string;
  actionId: string;
  timeout: string;
  policyId: string;
  createdDate: number;
  actionInstanceId: string;
}

// We are using a timeout here to prevent the UI from hanging if the agent is not responding (sensor not installed).
export function runTurboAction({
  volatileId,
  event,
  actionName,
  actionId,
  timeout,
  createdDate,
  actionInstanceId,
  policyId
}: RunTurboActionParams) {
  return turboSubmitActionExecution({
    action: 'turbonomic.executeAction',
    target: volatileId,
    args: {
      createdDate,
      actionInstanceId,
      async: 'true',
      event: JSON.stringify(event),
      eventId: event?.id,
      actionName,
      actionId,
      timeout: timeout === '' ? null : timeout,
      policyId: policyId === '' ? null : policyId
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
  timeout,
  policyId
}: RunScriptActionParams) {
  return runAction({
    type: SCRIPT_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    policyId,
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
  timeout,
  policyId
}: RunWebhookActionParams) {
  return runAction({
    type: WEBHOOK_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    policyId,
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
  ticketActionType: Field;
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
  ticketActionType,
  title,
  body,
  labels,
  assignees,
  policyId
}: RunGithubOpenActionParams) {
  return runAction({
    type: GITHUB_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    policyId,
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
        value: ticketActionType.value,
        encoding: ticketActionType.encoding
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
  ticketActionType: Field;
  comment: Field;
}

export function runGithubCloseAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  policyId,
  owner,
  repo,
  ticketActionType,
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
    policyId,
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
        value: ticketActionType.value,
        encoding: ticketActionType.encoding
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
  ticketActionType: Field;
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
  policyId,
  timeout,
  projectId,
  ticketActionType,
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
    policyId,
    request: [
      {
        name: 'projectId',
        value: projectId.value,
        encoding: projectId.encoding
      },

      {
        name: 'ticketActionType',
        value: ticketActionType.value,
        encoding: ticketActionType.encoding
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
  ticketActionType: Field;
  comment: Field;
}

export function runGitlabCloseAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  policyId,
  projectId,
  ticketActionType,
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
    policyId,
    request: [
      {
        name: 'projectId',
        value: projectId.value,
        encoding: projectId.encoding
      },
      {
        name: 'ticketActionType',
        value: ticketActionType.value,
        encoding: ticketActionType.encoding
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
  ticketActionType: Field;
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
  policyId,
  project,
  ticketActionType,
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
    policyId,
    request: [
      {
        name: 'project',
        value: project.value,
        encoding: project.encoding
      },

      {
        name: 'ticketActionType',
        value: ticketActionType.value,
        encoding: ticketActionType.encoding
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
  ticketActionType: Field;
  comment: Field;
}

export function runJiraCloseAction({
  volatileId,
  event,
  actionName,
  actionId,
  inputParameters,
  timeout,
  policyId,
  project,
  ticketActionType,
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
    policyId,
    request: [
      {
        name: 'project',
        value: project.value,
        encoding: project.encoding
      },
      {
        name: 'ticketActionType',
        value: ticketActionType.value,
        encoding: ticketActionType.encoding
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
  policyId
}: RunAnsibleActionParams) {
  return runAction({
    type: ANSIBlE_TYPE,
    volatileId,
    event,
    actionName,
    timeout,
    actionId,
    inputParameters,
    policyId,
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

export function resolveDynamicParameters({ eventId, parameters, timestamp }: GetDynamicParameterValues) {
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

export function getPolicies() {
  return http<Policy[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: policiesUrl,
    mapToResultObject: true
  });
}

export function getPolicy(id: string) {
  return http<Policy>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/${id}`,
    mapToResultObject: true
  });
}

export function saveNewPolicy(policy: NewPolicy) {
  return http<Policy>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: policiesUrl,
    data: policy,
    mapToResultObject: true
  });
}

export function deletePolicy(id: string) {
  return http<Policy>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/${encodeURIComponent(id)}`
  });
}

export function savePolicy(policy: NewPolicy, id: string) {
  return http<Policy>({
    method: 'PUT',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/${id}`,
    data: policy,
    mapToResultObject: true
  });
}

export function getPoliciesForTrigger(triggerId: string, triggerType: TriggerType) {
  return http<Policy[]>({
    method: 'GET',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}?triggerType=${triggerType}&triggerId=${encodeURIComponent(triggerId)}`,
    mapToResultObject: true
  });
}

export function saveBulkPolicies(policies: NewPolicy[]) {
  return http<Policy[]>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/bulk`,
    data: policies,
    mapToResultObject: true
  });
}

export function getEventSpecifications() {
  return http<EventSpecificationInfo[]>({
    method: 'GET',
    maxRetries: 3,
    url: '/api/events/settings/event-specifications/infos',
    mapToResultObject: true
  });
}

export function getApplicationSmartAlertConfigs() {
  return http<ApplicationAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.APPLICATION,
    mapToResultObject: true
  });
}

export function getWebsiteSmartAlertConfigs() {
  return http<WebsiteAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.WEBSITE,
    mapToResultObject: true
  });
}

export function getGlobalApplicationSmartAlertConfigs() {
  return http<GlobalApplicationsAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.APPLICATION_GLOBAL,
    mapToResultObject: true
  });
}

export function getMobileAppSmartAlertConfigs() {
  return http<MobileAppAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.MOBILEAPP,
    mapToResultObject: true
  });
}

export function getInfraSmartAlertConfigs() {
  return http<InfraAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.INFRA,
    mapToResultObject: true
  });
}

export function getLogSmartAlertConfigs() {
  return http<LogAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.LOGS,
    mapToResultObject: true
  });
}

export function getSyntheticSmartAlertConfigs() {
  return http<SyntheticAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.SYNTHETICS,
    mapToResultObject: true
  });
}

export function getBuiltInEventSpecification(id: string) {
  return http<EventSpecificationInfo>({
    method: 'GET',
    url: `/api/events/settings/event-specifications/built-in/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getCustomEventSpecification(id: string) {
  return http<EventSpecificationInfo>({
    method: 'GET',
    url: `/api/events/settings/event-specifications/custom/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getApplicationSmartAlertConfig(id: string) {
  return http<ApplicationAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.APPLICATION}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getGlobalApplicationSmartAlertConfig(id: string) {
  return http<ApplicationAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.APPLICATION_GLOBAL}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getWebsiteSmartAlertConfig(id: string) {
  return http<WebsiteAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.WEBSITE}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getMobileAppSmartAlertConfig(id: string) {
  return http<MobileAppAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.MOBILEAPP}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getInfraSmartAlertConfig(id: string) {
  return http<InfraAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.INFRA}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getLogSmartAlertConfig(id: string) {
  return http<LogAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.LOGS}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getSyntheticSmartAlertConfig(id: string) {
  return http<SyntheticAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.SYNTHETICS}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getDynamicParameterTagCatalog() {
  return http<TagCatalog>({
    method: 'GET',
    url: `${automationAPIBase}/parameters/dynamic/catalog`,
    maxRetries: 3,
    mapToResultObject: true
  });
}
