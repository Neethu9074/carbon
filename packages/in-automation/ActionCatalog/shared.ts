/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { keyBy } from 'lodash';

import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { AdditionalHeaders, Authen, NewAction } from 'in-automation/api';
import { Action, Field } from 'in-types';
import { t } from 'in-i18n';

export const getType = (type: string) => {
  if (isDocLink(type)) {
    return t('in-automation:ActionCatalog.docLink');
  } else if (isScript(type)) {
    return t('in-automation:ActionCatalog.script');
  } else if (isWebhook(type)) {
    return t('in-automation:ActionCatalog.http');
  } else if (isManual(type)) {
    return t('in-automation:ActionCatalog.manual');
  } else if (isExternal(type)) {
    return t('in-automation:actionHistory.external');
  } else if (isAnsible(type)) {
    return t('in-automation:ActionCatalog.ansible');
  } else if (isGithub(type)) {
    return t('in-automation:ActionCatalog.github');
  } else if (isGitlab(type)) {
    return t('in-automation:ActionCatalog.gitlab');
  } else if (isJira(type)) {
    return t('in-automation:ActionCatalog.jira');
  } else {
    return type;
  }
};

export const getHelpTextType = (type: string) => {
  if (isDocLink(type)) {
    return t('in-automation:ActionCatalog.docLinkHelpText');
  } else if (isScript(type)) {
    return t('in-automation:ActionCatalog.scripthelpText');
  } else if (isWebhook(type)) {
    return t('in-automation:ActionCatalog.httpHelpText');
  } else if (isManual(type)) {
    return t('in-automation:ActionCatalog.manualHelpText');
  } else if (isGithub(type)) {
    return t('in-automation:ActionCatalog.githubHelpText');
  } else if (isGitlab(type)) {
    return t('in-automation:ActionCatalog.gitlabHelpText');
  } else if (isJira(type)) {
    return t('in-automation:ActionCatalog.jiraHelpText');
  } else {
    return '';
  }
};

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
  getFieldsByNames(fields)?.authen ?? { value: `{"type":"${NO_AUTH}"}`, encoding: 'ascii', name: 'authen' };
export const getTimeoutFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.timeout ?? { value: '', encoding: 'ascii', name: 'timeout' };
export const getPlaybookIdFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.playbookId ?? { value: '', encoding: 'ascii', name: 'playbookId' };
export const getPlaybookFileNameFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.playbookFileName ?? { value: '', encoding: 'ascii', name: 'playbookFileName' };
export const getAnsibleUrlFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.ansibleUrl ?? { value: '', encoding: 'ascii', name: 'ansibleUrl' };
export const getGithubOwnerFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.owner ?? { value: '', encoding: 'ascii', name: 'owner' };
export const getGithubRepoFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.repo ?? { value: '', encoding: 'ascii', name: 'repo' };
export const getGithubTicketTypeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.ticketActionType ?? { value: `${OPEN}`, encoding: 'ascii', name: 'ticketActionType' };

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
  getFieldsByNames(fields)?.issue_type ?? { value: `${ISSUE}`, encoding: 'ascii', name: 'issue_type' };

export const getJiraProjectFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.project ?? { value: '', encoding: 'ascii', name: 'project' };
export const getJiraSummaryFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.summary ?? { value: '', encoding: 'ascii', name: 'summary' };
export const getJiraDescriptionFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.body ?? { value: '', encoding: 'ascii', name: 'body' };
export const getJiraAssigneeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.assignee ?? { value: '', encoding: 'ascii', name: 'assignee' };
export const getJiraIssueTypeFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.issue_type ?? { value: `${TASK}`, encoding: 'ascii', name: 'issue_type' };

export const getManualContentFromFields = (fields: Field[] | undefined): Field =>
  getFieldsByNames(fields)?.content ?? { value: '', encoding: 'base64', name: 'content' };

export const getInterpreterToUse = (action: Action | NewAction) => {
  const script = getScriptFromFields(action.fields);
  let plaintextScript = script.value;
  if (script.encoding === 'base64') {
    plaintextScript = atob(plaintextScript);
  }
  const hasShebang = plaintextScript.startsWith('#!');
  if (hasShebang) {
    return {
      encoding: 'base64',
      name: 'subtype',
      value: btoa(plaintextScript.split('\n')[0].replace('#!', '').trim())
    };
  }
  return getInterpreterFromFields(action.fields);
};

interface WebhookFields {
  host: Field;
  method: Field;
  body: Field;
  ignoreCertErrors: Field;
  authenParsed: Authen;
  authen: Field;
  headerParsed: AdditionalHeaders;
  header: Field;
}
export function getWebhookFields(action: Action | NewAction): WebhookFields {
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

interface AnsibleFields {
  playbookId: Field;
  playbookFileName: Field;
  ansibleUrl: Field;
  jobTemplateUrl: string;
}

export function getAnsibleFields(action: Action | NewAction): AnsibleFields {
  const playbookId = getPlaybookIdFromFields(action.fields);
  const playbookFileName = getPlaybookFileNameFromFields(action.fields);
  const ansibleUrl = getAnsibleUrlFromFields(action.fields);
  const jobTemplateUrl = `${ansibleUrl.value}/#/templates/job_template/${playbookId.value}`;
  return { playbookId, playbookFileName, ansibleUrl, jobTemplateUrl };
}

interface GithubOpenFields {
  title: Field;
  body: Field;
  labels: Field;
  assignees: Field;
}

interface GithubFields {
  owner: Field;
  repo: Field;
  ticketActionType: Field;
}

interface GithubCloseFields {
  comment: Field;
}

export function getGithubFields(action: Action | NewAction): GithubFields {
  const owner = getGithubOwnerFromFields(action.fields);
  const repo = getGithubRepoFromFields(action.fields);
  const ticketActionType = getGithubTicketTypeFromFields(action.fields);

  return { owner, repo, ticketActionType };
}
export function getGithubOpenTicketFields(action: Action | NewAction): GithubOpenFields {
  const title = getGithubTitleFromFields(action.fields);
  const body = getGithubBodyFromFields(action.fields);
  const labels = getGithubLabelsFromFields(action.fields);
  const assignees = getGithubAssigneesFromFields(action.fields);
  return { title, body, labels, assignees };
}

export function getCloseAndCommentFields(action: Action | NewAction): GithubCloseFields {
  const comment = getGithubCommentFromFields(action.fields);
  return { comment };
}

interface GitlabFields {
  projectId: Field;
  ticketActionType: Field;
}

export function getGitlabFields(action: Action | NewAction): GitlabFields {
  const projectId = getGitlabProjectIdFromFields(action.fields);
  const ticketActionType = getGithubTicketTypeFromFields(action.fields);

  return { projectId, ticketActionType };
}
interface GitlabOpenFields {
  title: Field;
  body: Field;
  labels: Field;
  issue_type: Field;
}

export function getGitlabOpenTicketFields(action: Action | NewAction): GitlabOpenFields {
  const title = getGithubTitleFromFields(action.fields);
  const body = getGitlabDescriptionFromFields(action.fields);
  const labels = getGithubLabelsFromFields(action.fields);
  const issue_type = getGitlabIssueTypeFromFields(action.fields);
  return { title, body, labels, issue_type };
}

interface JiraOpenFields {
  summary: Field;
  body: Field;
  labels: Field;
  assignee: Field;
  issue_type: Field;
}

interface JiraFields {
  project: Field;
  ticketActionType: Field;
}

export function getJiraFields(action: Action | NewAction): JiraFields {
  const project = getJiraProjectFromFields(action.fields);
  const ticketActionType = getGithubTicketTypeFromFields(action.fields);

  return { project, ticketActionType };
}

export function getJiraOpenTicketFields(action: Action | NewAction): JiraOpenFields {
  const summary = getJiraSummaryFromFields(action.fields);
  const body = getJiraDescriptionFromFields(action.fields);
  const labels = getGithubLabelsFromFields(action.fields);
  const assignee = getJiraAssigneeFromFields(action.fields);
  const issue_type = getJiraIssueTypeFromFields(action.fields);
  return { summary, body, labels, assignee, issue_type };
}

export const isDocLink = (type?: string) => type === DOC_LINK_TYPE;
export const isManual = (type?: string) => type === MANUAL_TYPE;
export const isScript = (type?: string) => type === SCRIPT_TYPE;
export const isWebhook = (type?: string) => type === WEBHOOK_TYPE;
export const isExternal = (type?: string) => type === EXTERNAL_TYPE;
export const isAnsible = (type?: string) => type === ANSIBlE_TYPE;
export const isGithub = (type?: string) => type === GITHUB_TYPE;
export const isGitlab = (type?: string) => type === GITLAB_TYPE;
export const isJira = (type?: string) => type === JIRA_TYPE;

export const DOC_LINK_TYPE = 'doc_link';
export const MANUAL_TYPE = 'MANUAL';
export const SCRIPT_TYPE = 'SCRIPT';
export const WEBHOOK_TYPE = 'HTTP';
export const EXTERNAL_TYPE = 'EXTERNAL';
export const ANSIBlE_TYPE = 'ANSIBLE';
export const GITHUB_TYPE = 'GITHUB';
export const GITLAB_TYPE = 'GITLAB';
export const JIRA_TYPE = 'JIRA';

export const HTTP_METHODS = Object.freeze(['GET', 'POST', 'PUT', 'DELETE']);
export const HTTP_METHODS_WITH_BODY = Object.freeze(['POST', 'PUT']);
export const OPEN = 'open';
export const CLOSE = 'close';
export const ADD_COMMENT = 'add_comment';
export const GH_TICKET_TYPES = Object.freeze([
  { value: OPEN, translation: t('in-automation:openIssue') },
  { value: CLOSE, translation: t('in-automation:closeIssue') },
  { value: ADD_COMMENT, translation: t('in-automation:commentIssue') }
]);

export const JIRA_OPERATIONS = Object.freeze([
  { value: OPEN, translation: t('in-automation:openTask') },
  { value: CLOSE, translation: t('in-automation:closeTask') },
  { value: ADD_COMMENT, translation: t('in-automation:commentTask') }
]);

export const ISSUE = 'issue';
export const INCIDENT = 'incident';
export const TEST_CASE = 'test_case';
export const GL_ISSUE_TYPES = Object.freeze([
  { value: ISSUE, translation: t('in-automation:issue') },
  { value: INCIDENT, translation: t('in-automation:incident') },
  { value: TEST_CASE, translation: t('in-automation:testcase') }
]);

export const EPIC = 'Epic';
export const TASK = 'Task';
export const BUG = 'Bug';
export const IMPROVEMENT = 'Improvement';
export const NEW_FEATURE = 'New Feature';
export const JIRA_ISSUE_TYPES = Object.freeze([
  { value: EPIC, translation: t('in-automation:ActionCatalog.epic') },
  { value: TASK, translation: t('in-automation:ActionCatalog.task') },
  { value: BUG, translation: t('in-automation:ActionCatalog.bug') },
  { value: IMPROVEMENT, translation: t('in-automation:ActionCatalog.improvement') },
  { value: NEW_FEATURE, translation: t('in-automation:ActionCatalog.newFeature') }
]);

export const NO_AUTH = 'noAuth';
export const BASIC_AUTH = 'basicAuth';
export const BEARER_TOKEN = 'bearerToken';
export const API_KEY = 'apiKey';

export const AUTH_TYPES = Object.freeze([
  { value: NO_AUTH, translation: t('in-automation:ActionCatalog.noAuth') },
  { value: BASIC_AUTH, translation: t('in-automation:ActionCatalog.basicAuth') },
  { value: BEARER_TOKEN, translation: t('in-automation:ActionCatalog.bearerToken') },
  { value: API_KEY, translation: t('in-automation:ActionCatalog.apiKey') }
]);

export type selectedEventsTypes = { builtin_event_ids: string[]; custom_event_ids: string[] };

function safeParseJSON<T>(str: string = '{}') {
  try {
    return JSON.parse(str) as T;
  } catch {
    return {};
  }
}

type VaultParameter = { secretKey: string; secretPath: string };
const isVaultParameter = (param: VaultParameter | {}): param is VaultParameter => {
  return 'secretKey' in param && 'secretPath' in param;
};
export const parseVaultParameter = (str?: string) => {
  const vaultParameter = safeParseJSON<VaultParameter>(str);
  if (!isVaultParameter(vaultParameter)) {
    return { secretKey: '', secretPath: '' };
  }
  return vaultParameter;
};

type DynamicParameter = { key?: string; tagName: string };
const isDynamicParameter = (param: DynamicParameter | {}): param is DynamicParameter => {
  return 'tagName' in param;
};
export const parseDynamicParameter = (str?: string) => {
  const dynamicParameter = safeParseJSON<DynamicParameter>(str);
  if (!isDynamicParameter(dynamicParameter)) {
    return { key: '', tagName: '' };
  }
  return dynamicParameter;
};

export const isNotEditable = (action: Action | NewAction, isCopy: boolean) =>
  ((action?.metadata?.builtIn ?? false) && !isCopy) || isAnsible(action.type);

export const doesParameterExist = (parameters: MappedParameter[], paramName: string) => {
  return parameters.some(param => param.value.name === paramName);
};
