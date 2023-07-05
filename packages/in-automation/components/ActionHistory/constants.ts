/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { actionHistoryPath } from 'in-automation/navigation/paths';
import { Options } from 'in-hooks/useUrlState';
export const pathSegment = actionHistoryPath;
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
