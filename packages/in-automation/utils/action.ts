/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Action } from '@instana/types';

import { ACTION_TYPE, GIT_OPERATIONS, GL_ISSUE_TYPES, JIRA_OPERATIONS } from 'in-automation/constants';
import { NewAction } from 'in-automation/types';
import { role } from 'in-stores/user';

export const isAIAction = (action: Action | NewAction) =>
  (action?.metadata?.builtIn && action?.metadata?.ai !== null) ?? false;

export const isAIActionCopy = (action: Action | NewAction) => action?.metadata?.aiOriginated ?? false;

export const aiOriginatedMetadata = {
  readOnly: false,
  builtIn: false,
  sensorImported: false,
  aiOriginated: true
} as const;

export const isNotEditable = (action: Action | NewAction, isCopy: boolean) =>
  ((action.metadata?.builtIn ?? false) && !isCopy) ||
  action.type === ACTION_TYPE.ANSIBLE ||
  !role?.canConfigureAutomationActions;

export const getGitOperation = (operation: string) =>
  GIT_OPERATIONS.find(item => item.value === operation)?.translation;

export const getGLOperation = (operation: string) => {
  return GL_ISSUE_TYPES.find(item => item.value === operation)?.translation ?? '-';
};

export const getJiraOperation = (operation: string) => {
  return JIRA_OPERATIONS.find(item => item.value === operation)?.translation ?? '-';
};
