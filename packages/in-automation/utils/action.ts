/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Action } from '@instana/types';

import { ACTION_TYPE } from 'in-automation/constants';
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
