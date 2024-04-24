/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { actionHistory } from 'in-automation/navigation/paths';
import { Options } from 'in-hooks/useUrlState';
import { t } from 'in-i18n';
export const pathSegment = actionHistory;
export const matrixPrefix = '';

export interface FilterState {
  types: string[];
  actionStatuses: string[];
}

export type CurrentState = {
  types?: string[];
  actionStatuses?: string[];
};

export type Timing = {
  label: string;
  value: number;
};

export const actionTypesUrlParameter = {
  path: pathSegment,
  name: 'types',
  as: 'types',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export const actionStatusesUrlParameter = {
  path: pathSegment,
  name: 'actionStatuses',
  as: 'actionStatuses',
  initialState: [],
  parser: buildJsonParser([]),
  serializer: buildJsonSerializer()
};

export interface UrlState {
  orderBy: string;
  orderDirection: string;
  page: number;
  query: string;
}
export const filterUrlStateDefinition = {
  bind: [actionTypesUrlParameter, actionStatusesUrlParameter]
} as Options<UrlState>;

export interface FilterSectionProps extends FilterState {
  setFilter: (x: Object) => void;
  types: string[];
  actionStatuses: string[];
}

export const getActorType = (type: string) => {
  if (isUser(type)) {
    return t('in-automation:actionHistory.user');
  } else if (isPolicy(type)) {
    return t('in-automation:policies.policy');
  } else if (isApiToken(type)) {
    return t('in-automation:actionHistory.apiToken');
  } else {
    return '';
  }
};

export const isUser = (type?: string) => type === 'USER';
export const isPolicy = (type?: string) => type === 'POLICY';
export const isApiToken = (type?: string) => type === 'APITOKEN';
export const isUnknown = (type?: string) => type === 'ACTOR_UNKNOWN';
