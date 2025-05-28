/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ActionType, TypeConfigurationType } from '@instana/types';

import { AuthenType } from 'in-automation/types';
import { t } from 'in-i18n';

export const ACTION_TYPE: Record<ActionType, ActionType> = {
  DOC_LINK: 'DOC_LINK',
  GITHUB: 'GITHUB',
  SCRIPT: 'SCRIPT',
  HTTP: 'HTTP',
  MANUAL: 'MANUAL',
  GITLAB: 'GITLAB',
  JIRA: 'JIRA',
  ANSIBLE: 'ANSIBLE',
  EXTERNAL: 'EXTERNAL'
};
export const EXECUTABLE_ACTIONS: ActionType[] = [
  ACTION_TYPE.SCRIPT,
  ACTION_TYPE.HTTP,
  ACTION_TYPE.ANSIBLE,
  ACTION_TYPE.GITHUB,
  ACTION_TYPE.GITLAB,
  ACTION_TYPE.JIRA
];
export const NON_CREATABLE_ACTION_TYPES: ActionType[] = [ACTION_TYPE.ANSIBLE, ACTION_TYPE.EXTERNAL];
export const ACTION_TYPES: ActionType[] = Object.values(ACTION_TYPE);
export const ACTION_TRANSLATIONS: Record<ActionType, string> = {
  SCRIPT: t('in-automation:ActionCatalog.script'),
  HTTP: t('in-automation:ActionCatalog.http'),
  ANSIBLE: t('in-automation:ActionCatalog.ansible'),
  EXTERNAL: t('in-automation:actionHistory.external'),
  GITHUB: t('in-automation:ActionCatalog.github'),
  GITLAB: t('in-automation:ActionCatalog.gitlab'),
  JIRA: t('in-automation:ActionCatalog.jira'),
  MANUAL: t('in-automation:ActionCatalog.manual'),
  DOC_LINK: t('in-automation:ActionCatalog.docLink')
};

export const ScoredActionsType: Record<string, string> = {
  POLICY: t('in-automation:policies.policy'),
  SUCCESS_RATE: t('in-automation:recommendation'),
  NLP: t('in-automation:recommendation'),
  EVENT_SIMILARITY: t('in-automation:recommendation'),
  TURBONOMIC: 'Turbonomic'
};

export const ScoredActionsAIEngine: Record<string, string> = {
  POLICY: t('in-automation:userCreated'),
  SUCCESS_RATE: t('in-automation:successRate'),
  NLP: 'NLP',
  EVENT_SIMILARITY: t('in-automation:eventSimilarity'),
  TURBONOMIC: t('in-automation:optimization')
};

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];
export const HTTP_METHODS_WITH_BODY = ['POST', 'PUT'];

export const AUTH_TYPE: Record<'NO_AUTH' | 'BASIC_AUTH' | 'BEARER_TOKEN' | 'API_KEY', AuthenType> = {
  NO_AUTH: 'noAuth' as const,
  BASIC_AUTH: 'basicAuth',
  BEARER_TOKEN: 'bearerToken',
  API_KEY: 'apiKey'
};

export const AUTH_TYPES: AuthenType[] = Object.values(AUTH_TYPE);
export const AUTH_TRANSLATIONS: Record<AuthenType, string> = {
  noAuth: t('in-automation:ActionCatalog.noAuth'),
  basicAuth: t('in-automation:ActionCatalog.basicAuth'),
  bearerToken: t('in-automation:ActionCatalog.bearerToken'),
  apiKey: t('in-automation:ActionCatalog.apiKey')
};

export const OPEN = 'open';
export const CLOSE = 'close';
export const ADD_COMMENT = 'add_comment';
export const GIT_OPERATIONS = Object.freeze([
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
export const GL_ISSUE_TYPES = Object.freeze([
  { value: ISSUE, translation: t('in-automation:issue') },
  { value: INCIDENT, translation: t('in-automation:incident') }
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

export const POLICY_TYPE: Record<Uppercase<TypeConfigurationType>, TypeConfigurationType> = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
};
export const POLICY_TYPES: TypeConfigurationType[] = Object.values(POLICY_TYPE);

export const NO_FIELD_VALUE = '-';

export const POLICY_TYPE_TRANSLATIONS: Record<TypeConfigurationType, string> = {
  manual: t('in-automation:policies.manual'),
  automatic: t('in-automation:policies.automatic')
};
