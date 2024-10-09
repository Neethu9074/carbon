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
  ActionInstance,
  Policy,
  TagCatalog,
  ParameterValue,
  GetDynamicParameterValues,
  TriggerType,
  WebsiteAlertConfigWithMetadata,
  MobileAppAlertConfigWithMetadata,
  LogAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata,
  ServiceLevelsAlertConfigWithMetadata,
  ActionType,
  ActionNameExists,
  ResourceOptimization
} from 'in-types';
import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import submitTurbonomicResourceImpact from 'in-automation/subscriptions/submitTurbonomicResourceImpact';
import turboSubmitActionExecution from 'in-automation/subscriptions/turboSubmitActionExecution';
import { baseUrl as apiEndpoint } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import { DOC_LINK_TYPE, HTTP_METHODS_WITH_BODY } from 'in-automation/ActionCatalog/shared';
import submitActionExecution from 'in-automation/subscriptions/submitActionExecution';
import { getHeader as getCsrfHeader } from 'in-services/security/csrf';
import { NewPolicy } from 'in-automation/Policies/types';
import { mapData } from 'in-services/util/result';
import { minutes } from 'in-services/time';
import http from 'in-services/http';
import { t } from 'in-i18n';

const automationAPIBase = '/api/automation';
const turboAPIBase = '/api/turbonomic';
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

export function getActionTags() {
  return http<{ tags: string[] }>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/tags`,
    mapToResultObject: true
  });
}

export interface ScoredAction extends Action {
  score: number;
  confidence: string;
  aiEngine: string;
}

export function getAllActionsWithAISuggestions(
  name: string,
  description: string,
  targetSnapshotId?: string,
  type?: 'default' | 'watsonx',
  eventId?: string
) {
  return http<ActionMatch[]>({
    method: 'POST',
    maxRetries: 3,
    url: `${automationAPIBase}/ai/action/match${
      targetSnapshotId ? `?targetSnapshotId=${encodeURIComponent(targetSnapshotId)}` : ''
    }`,
    data: {
      name,
      description,
      type,
      eventId
    },
    headers: getCsrfHeader(),
    mapToResultObject: true
  }).map(response =>
    mapData(response, actions =>
      actions.map(({ action, score, confidence, aiEngine }) => ({ ...action, score, confidence, aiEngine }))
    )
  );
}

export function getResourceOptimization(targetSnapshotId: string, entityType: string | null) {
  return http<ResourceOptimization>({
    method: 'GET',
    maxRetries: 3,
    url: `${turboAPIBase}/recommendedActions?targetSnapshotId=${encodeURIComponent(
      targetSnapshotId
    )}&entityType=${entityType}`,
    mapToResultObject: true,
    headers: getCsrfHeader()
  });
}

export function getAction(actionId: string) {
  return http<Action>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(actionId)}`,
    mapToResultObject: true
  });
}

export function saveNewAction(actionSpecification: NewAction) {
  return http<Action>({
    method: 'POST',
    maxRetries: 3,
    url: actionUrl,
    headers: getCsrfHeader(),
    data: actionSpecification,
    mapToResultObject: true
  });
}

export function saveAction(actionSpecification: NewAction, id: string) {
  return http<Action>({
    method: 'PUT',
    maxRetries: 3,
    url: `${actionUrl}/${encodeURIComponent(id)}`,
    headers: getCsrfHeader(),
    data: actionSpecification,
    mapToResultObject: true
  });
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
  type: ActionType = DOC_LINK_TYPE,
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

interface RunActionParams {
  volatileId: VolatileId;
  eventId: string | undefined;
  actionName: string;
  actionId: string;
  inputParameters: ParameterValue[];
  timeout: string;
  hostsLimit?: string;
  policyId: string;
}

// We are using a timeout here to prevent the UI from hanging if the agent is not responding (sensor not installed).
export function runAction({
  volatileId,
  actionName,
  eventId,
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
      hostsLimit,
      inputParameters,
      async: 'true',
      eventId: eventId,
      actionName,
      actionId,
      timeout: timeout === '' ? null : timeout,
      policyId: policyId === '' ? null : policyId
    }
  });
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

interface RunResourceOptimizationAction {
  volatileId: VolatileId;
  actionName: string;
  createdDate: number;
  actionInstanceId: string;
}

// We are using a timeout here to prevent the UI from hanging if the agent is not responding (sensor not installed).
export function runResourceOptimizationAction({
  volatileId,
  actionName,
  createdDate,
  actionInstanceId
}: RunResourceOptimizationAction) {
  return turboSubmitActionExecution({
    action: 'turbonomic.executeAction',
    target: volatileId,
    args: {
      createdDate,
      actionInstanceId,
      actionName
    }
  });
}

interface GetTurboResourceImpactParams {
  volatileId: VolatileId;
  createdDate: number;
  actionInstanceId: string;
}

export function getTurboActionResourceImpacts({
  volatileId,
  actionInstanceId,
  createdDate
}: GetTurboResourceImpactParams) {
  {
    return submitTurbonomicResourceImpact({
      action: 'turbonomic.resourceImpact',
      target: volatileId,
      args: {
        createdDate,
        actionInstanceId
      }
    });
  }
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
    url: policiesUrl,
    mapToResultObject: true
  });
}

export function getPolicyTags() {
  return http<{ tags: string[] }>({
    method: 'GET',
    maxRetries: 3,
    url: `${policiesUrl}/tags`,
    mapToResultObject: true
  });
}

export function getPolicy(id: string) {
  return http<Policy>({
    method: 'GET',
    maxRetries: 3,
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

export function saveBulkPolicies(policies: NewPolicy[]): Observable<Policy[]> {
  return http<Policy[]>({
    method: 'POST',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${policiesUrl}/bulk`,
    data: policies
  }).map(response => response.body);
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
  return http<ApplicationSmartAlertConfigWithMetadata[]>({
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
  return http<GlobalApplicationsSmartAlertConfigWithMetadata[]>({
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
  return http<InfraSmartAlertConfigWithMetadata[]>({
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

export function getSloSmartAlertConfigs() {
  return http<ServiceLevelsAlertConfigWithMetadata[]>({
    method: 'GET',
    maxRetries: 3,
    url: apiEndpoint.SLO,
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

export function getEventSpecification(id: string) {
  return http<EventSpecificationInfo[]>({
    method: 'POST',
    url: `/api/events/settings/event-specifications/infos`,
    maxRetries: 3,
    mapToResultObject: true,
    data: [id],
    headers: getCsrfHeader()
  }).map(res => mapData(res, data => data?.[0]));
}

export function getApplicationSmartAlertConfig(id: string) {
  return http<ApplicationSmartAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.APPLICATION}/${encodeURIComponent(id)}`,
    maxRetries: 3,
    mapToResultObject: true
  });
}

export function getGlobalApplicationSmartAlertConfig(id: string) {
  return http<ApplicationSmartAlertConfigWithMetadata>({
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
  return http<InfraSmartAlertConfigWithMetadata>({
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

export function getSloSmartAlertConfig(id: string) {
  return http<ServiceLevelsAlertConfigWithMetadata>({
    method: 'GET',
    url: `${apiEndpoint.SLO}/${encodeURIComponent(id)}`,
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

export function deleteActionInstance(id: string, createdDate: number) {
  return http<{ deletedDocumentsCount: string }>({
    method: 'DELETE',
    maxRetries: 3,
    headers: getCsrfHeader(),
    url: `${automationAPIBase}/actioninstances/${encodeURIComponent(id)}`,
    queryParams: {
      to: createdDate + minutes.toMillis(10),
      from: createdDate - minutes.toMillis(10)
    }
  }).map(response => response.body);
}

export function getActionNameExists(name: string, type: ActionType) {
  return http<ActionNameExists>({
    method: 'GET',
    maxRetries: 3,
    url: `${actionUrl}/names/exists`,
    queryParams: {
      name,
      type
    },
    mapToResultObject: true
  });
}

export type ActionFilter = { types: ActionType[]; tags: string[] };
export function getActionFilter() {
  return http<ActionFilter>({
    method: 'GET',
    url: `${actionUrl}/rbacActionFilters`,
    maxRetries: 3,
    mapToResultObject: true
  });
}
