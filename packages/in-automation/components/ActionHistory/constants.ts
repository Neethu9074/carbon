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

// export function getTranslation(input: string) {
//   const translations = {
//     script_ssh: 'in-automation:ActionCatalog.script',
//     timeout: 'in-automation:ActionCatalog.timeout',
//     subtype: 'in-automation:ActionCatalog.interpreter',
//     method: 'in-automation:ActionCatalog.method',
//     host: 'in-automation:ActionCatalog.host',
//     header: 'in-automation:ActionCatalog.header',
//     ignoreCertErrors: 'in-automation:ActionCatalog.ignoreCertErrors',
//     authentication: 'in-automation:ActionCatalog.authentication',
//     body: 'in-automation:ActionCatalog.body',
//     owner: 'in-automation:owner',
//     repo: 'in-automation:repo',
//     ticketActionType: 'in-automation:operation',
//     title: 'in-automation:title',
//     // body: 'in-automation:ActionCatalog.githubBody',
//     labels: 'in-automation:labels',
//     assignees: 'in-automation:assignees',
//     comment: 'in-automation:comment',
//     projectId: 'in-automation:projectId',
//     issue_type: 'in-automation:issueType',
//     project: 'in-automation:project',
//     summary: 'in-automation:title',
//     assignee: 'in-automation:assignee'
//   };

//   return translations[input as keyof typeof translations] || input;
// }

// export const ACTION_FIELD_TRANSLATIONS: Record<string, string> = {
//   script_ssh: t('in-automation:ActionCatalog.script'),
//   timeout: t('in-automation:ActionCatalog.timeout'),
//   subtype: t('in-automation:ActionCatalog.interpreter'),
//   method: t('in-automation:ActionCatalog.method'),
//   host: t('in-automation:ActionCatalog.host'),
//   header: t('in-automation:ActionCatalog.header'),
//   ignoreCertErrors: t('in-automation:ActionCatalog.ignoreCertErrors'),
//   authen: t('in-automation:ActionCatalog.authentication'),
//   body: t('in-automation:ActionCatalog.body'),
//   owner: t('in-automation:owner'),
//   repo: t('in-automation:repo'),
//   ticketActionType: t('in-automation:operation'),
//   title: t('in-automation:title'),
//   // body: 'in-automation:ActionCatalog.githubBody',
//   labels: t('in-automation:labels'),
//   assignees: t('in-automation:assignees'),
//   comment: t('in-automation:comment'),
//   projectId: t('in-automation:projectId'),
//   issue_type: t('in-automation:issueType'),
//   project: t('in-automation:project'),
//   summary: t('in-automation:title'),
//   assignee: t('in-automation:assignee')
// };

export const ACTION_FIELD_TRANSLATIONS: Record<string, string> = {
  script_ssh: t('in-automation:ActionCatalog.script'),
  timeout: t('in-automation:ActionCatalog.timeout'),
  subtype: t('in-automation:ActionCatalog.interpreter'),
  method: t('in-automation:ActionCatalog.method'),
  host: t('in-automation:ActionCatalog.host'),
  header: t('in-automation:ActionCatalog.header'),
  ignoreCertErrors: t('in-automation:ActionCatalog.ignoreCertErrors'),
  authen: t('in-automation:ActionCatalog.authentication'),
  body: t('in-automation:ActionCatalog.githubBody'),
  owner: t('in-automation:owner'),
  repo: t('in-automation:repo'),
  ticketActionType: t('in-automation:operation'),
  title: t('in-automation:title'),
  labels: t('in-automation:labels'),
  assignees: t('in-automation:assignees'),
  comment: t('in-automation:comment'),
  projectId: t('in-automation:projectId'),
  issue_type: t('in-automation:issueType'),
  project: t('in-automation:project'),
  summary: t('in-automation:title'),
  assignee: t('in-automation:assignee'),
  description: t('in-automation:description')
};
