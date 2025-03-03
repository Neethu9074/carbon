/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { keyBy } from 'lodash';

import { Action, Field } from '@instana/types';

import { HTTP_METHODS_WITH_BODY, AUTH_TYPE, ISSUE, OPEN, TASK } from 'in-automation/constants';
import { Authen, NewAction } from 'in-automation/types';

function utf8ToBase64(str: string) {
  return window.btoa(String.fromCharCode(...new TextEncoder().encode(str)));
}

export function base64ToUtf8(base64: string) {
  return new TextDecoder().decode(Uint8Array.from(window.atob(base64), c => c.charCodeAt(0)));
}

const getFieldsByNames = (fields: Field[] | undefined): Record<string, Field | null> => keyBy(fields, 'name');
export const getScriptFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.script_content ??
  getFieldsByNames(fields)?.script_ssh ?? { value: '', encoding: 'base64', name: 'script_ssh' };
export const getInterpreterFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.interpreter ??
  getFieldsByNames(fields)?.subtype ?? { value: '', encoding: 'base64', name: 'subtype' };
export const getDocLinkFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.URL ?? { value: '', encoding: 'UTF8', name: 'URL' };
export const getBodyFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.body ?? { value: '', encoding: 'ascii', name: 'body' };
export const getHeaderFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.header ?? { value: '{}', encoding: 'ascii', name: 'header' };
export const getMethodFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.method ?? { value: 'GET', encoding: 'ascii', name: 'method' };
export const getHostFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.host ?? { value: '', encoding: 'ascii', name: 'host' };
export const getIgnoreCertErrorsFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.ignoreCertErrors ?? { value: 'false', encoding: 'ascii', name: 'ignoreCertErrors' };
export const getAuthenFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.authen ?? { value: `{"type":"${AUTH_TYPE.NO_AUTH}"}`, encoding: 'ascii', name: 'authen' };
export const getTimeoutFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.timeout ?? { value: '', encoding: 'ascii', name: 'timeout' };
export const getPlaybookIdFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.playbookId ?? { value: '', encoding: 'ascii', name: 'playbookId' };
export const getWorkflowIdFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.workflowId ?? { value: '', encoding: 'ascii', name: 'workflowId' };
export const getPlaybookFileNameFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.playbookFileName ?? { value: '', encoding: 'ascii', name: 'playbookFileName' };
export const getAnsibleUrlFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.ansibleUrl ?? { value: '', encoding: 'ascii', name: 'ansibleUrl' };
export const getAnsibleHostIdFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.hostId ?? { value: '', encoding: 'ascii', name: 'hostId' };
export const getGithubOwnerFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.owner ?? { value: '', encoding: 'ascii', name: 'owner' };
export const getGithubRepoFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.repo ?? { value: '', encoding: 'ascii', name: 'repo' };
export const getGithubTicketTypeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.ticketActionType ?? { value: OPEN, encoding: 'ascii', name: 'ticketActionType' };

export const getGithubTitleFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.title ?? { value: '', encoding: 'ascii', name: 'title' };
export const getGithubBodyFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.body ?? { value: '', encoding: 'ascii', name: 'body' };
export const getGithubLabelsFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.labels ?? { value: '', encoding: 'ascii', name: 'labels' };
export const getGithubAssigneesFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.assignees ?? { value: '', encoding: 'ascii', name: 'assignees' };

export const getGithubCommentFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.comment ?? { value: '', encoding: 'ascii', name: 'comment' };

export const getGitlabProjectIdFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.projectId ?? { value: '', encoding: 'ascii', name: 'projectId' };
export const getGitlabDescriptionFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.body ?? { value: '', encoding: 'ascii', name: 'body' };
export const getGitlabIssueTypeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.issue_type ?? { value: ISSUE, encoding: 'ascii', name: 'issue_type' };

export const getJiraProjectFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.project ?? { value: '', encoding: 'ascii', name: 'project' };
export const getJiraSummaryFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.summary ?? { value: '', encoding: 'ascii', name: 'summary' };
export const getJiraDescriptionFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.body ?? { value: '', encoding: 'ascii', name: 'body' };
export const getJiraAssigneeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.assignee ?? { value: '', encoding: 'ascii', name: 'assignee' };
export const getJiraIssueTypeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.issue_type ?? { value: TASK, encoding: 'ascii', name: 'issue_type' };

export const getManualContentFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.content ?? { value: '', encoding: 'base64', name: 'content' };

export function getInterpreterToUse(action: Action | NewAction) {
  const script = getScriptFromFields(action.fields);
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = base64ToUtf8(plaintextScript);
  }
  const hasShebang = plaintextScript.startsWith('#!');
  if (hasShebang) {
    return {
      encoding: 'base64',
      name: 'subtype',
      value: utf8ToBase64(plaintextScript.split('\n')[0].replace('#!', '').trim())
    };
  }
  return getInterpreterFromFields(action.fields);
}

export function getWebhookFields(action: Action | NewAction): {
  host: Field;
  method: Field;
  body: Field;
  ignoreCertErrors: Field;
  authenParsed: Authen;
  authen: Field;
  headerParsed: AdditionalHeaders;
  header: Field;
} {
  const host = getHostFromFields(action.fields);
  const method = getMethodFromFields(action.fields);
  const body = getBodyFromFields(action.fields);
  const header = getHeaderFromFields(action.fields);
  const ignoreCertErrors = getIgnoreCertErrorsFromFields(action.fields);
  const authen = getAuthenFromFields(action.fields);
  const authenParsed: Authen = JSON.parse(authen.value);
  const headerParsed: AdditionalHeaders = JSON.parse(header.value);
  return { host, method, body, ignoreCertErrors, authen, authenParsed, header, headerParsed };
}

export function getAnsibleFields(action: Action | NewAction): {
  isWorkflowJobTemplate: boolean;
  jobTemplateUrl: string;
} {
  const workflowId = getWorkflowIdFromFields(action.fields);
  const playbookId = getPlaybookIdFromFields(action.fields);
  const ansibleUrl = getAnsibleUrlFromFields(action.fields);
  const isWorkflowJobTemplate = workflowId?.value !== '';
  const ansibleId = isWorkflowJobTemplate ? workflowId : playbookId;
  const templateName = isWorkflowJobTemplate ? 'workflow_job_template' : 'job_template';
  const jobTemplateUrl = `${ansibleUrl.value}/#/templates/${templateName}/${ansibleId.value}`;
  return { jobTemplateUrl, isWorkflowJobTemplate };
}

export function getGithubFields(action: Action | NewAction): {
  owner: Field;
  repo: Field;
  ticketActionType: Field;
} {
  const owner = getGithubOwnerFromFields(action.fields);
  const repo = getGithubRepoFromFields(action.fields);
  const ticketActionType = getGithubTicketTypeFromFields(action.fields);

  return { owner, repo, ticketActionType };
}
export function getGithubOpenTicketFields(action: Action | NewAction): {
  title: Field;
  body: Field;
  labels: Field;
  assignees: Field;
} {
  const title = getGithubTitleFromFields(action.fields);
  const body = getGithubBodyFromFields(action.fields);
  const labels = getGithubLabelsFromFields(action.fields);
  const assignees = getGithubAssigneesFromFields(action.fields);
  return { title, body, labels, assignees };
}

export function getCloseAndCommentFields(action: Action | NewAction): {
  comment: Field;
} {
  const comment = getGithubCommentFromFields(action.fields);
  return { comment };
}

export function getGitlabFields(action: Action | NewAction): {
  projectId: Field;
  ticketActionType: Field;
} {
  const projectId = getGitlabProjectIdFromFields(action.fields);
  const ticketActionType = getGithubTicketTypeFromFields(action.fields);

  return { projectId, ticketActionType };
}

export function getGitlabOpenTicketFields(action: Action | NewAction): {
  title: Field;
  body: Field;
  labels: Field;
  issue_type: Field;
} {
  const title = getGithubTitleFromFields(action.fields);
  const body = getGitlabDescriptionFromFields(action.fields);
  const labels = getGithubLabelsFromFields(action.fields);
  const issue_type = getGitlabIssueTypeFromFields(action.fields);
  return { title, body, labels, issue_type };
}

export function getJiraFields(action: Action | NewAction): {
  project: Field;
  ticketActionType: Field;
} {
  const project = getJiraProjectFromFields(action.fields);
  const ticketActionType = getGithubTicketTypeFromFields(action.fields);

  return { project, ticketActionType };
}

export function getJiraOpenTicketFields(action: Action | NewAction): {
  summary: Field;
  body: Field;
  labels: Field;
  assignee: Field;
  issue_type: Field;
} {
  const summary = getJiraSummaryFromFields(action.fields);
  const body = getJiraDescriptionFromFields(action.fields);
  const labels = getGithubLabelsFromFields(action.fields);
  const assignee = getJiraAssigneeFromFields(action.fields);
  const issue_type = getJiraIssueTypeFromFields(action.fields);
  return { summary, body, labels, assignee, issue_type };
}

export function createDocLinkField(value: string): Field {
  return {
    value,
    description: 'URL to remediation documentation',
    encoding: 'UTF8',
    name: 'URL'
  };
}

export function createManualField(value: string): Field {
  return {
    value: utf8ToBase64(value),
    description: 'Content for manual action',
    encoding: 'base64',
    name: 'content'
  };
}

export function createScriptFields({
  value,
  subtype,
  timeout
}: {
  value: string;
  subtype: string;
  timeout: string;
}): Field[] {
  return [
    {
      value: utf8ToBase64(subtype),
      description: 'script subtype',
      encoding: 'base64',
      name: 'subtype'
    },
    {
      value: utf8ToBase64(value),
      description: 'script content',
      encoding: 'base64',
      name: 'script_ssh'
    },
    { ...createTimeoutField(timeout) }
  ];
}

type AdditionalHeaders = { [k: string]: string };

export function createWebhookFields({
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
}: {
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
}): Field[] {
  return [
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
}

export function createGithubFields({
  owner,
  repo,
  ticketActionType
}: {
  owner: string;
  repo: string;
  ticketActionType: TicketTypes | null;
}): Field[] {
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
}

export function createGithubOpenFields({ title, body, labels, assignees }: GithubOpenFields): Field[] {
  return [
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
}

export const createGithubCloseAndCommentFields = ({ comment }: GithubCloseAndCommentFields): Field[] => [
  {
    value: comment,
    description: 'github issue comment',
    encoding: 'ascii',
    name: 'comment'
  }
];

interface GitlabOpenFields {
  title: string;
  body: string;
  labels: string;
  issue_type: string;
}

export function createGitlabFields({
  projectId,
  ticketActionType
}: {
  projectId: string;
  ticketActionType: TicketTypes | null;
}): Field[] {
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
}

export function createGitlabOpenFields({ title, body, labels, issue_type }: GitlabOpenFields): Field[] {
  return [
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
}

interface JiraOpenFields {
  summary: string;
  assignee: string;
  body: string;
  labels: string;
  issue_type: string;
}

export function createJiraFields({
  project,
  ticketActionType
}: {
  project: string;
  ticketActionType: TicketTypes | null;
}): Field[] {
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
}

export function createJiraOpenFields({ summary, body, assignee, labels, issue_type }: JiraOpenFields): Field[] {
  return [
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

export function createTimeoutField(value: string): Field {
  return {
    value,
    description: 'timeout of the action execution in seconds',
    encoding: 'ascii',
    name: 'timeout'
  };
}
