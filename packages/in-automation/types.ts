/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  EventSpecificationInfo,
  ActionType,
  Action,
  Policy,
  TypeConfiguration,
  PolicyRunnable,
  Trigger,
  RunConfiguration,
  ActionConfiguration,
  WebsiteAlertConfigWithMetadata,
  MobileAppAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata,
  LogAlertConfigWithMetadata,
  ServiceLevelsAlertConfigWithMetadata,
  Result
} from '@instana/types';

import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';

export type ScoredAction = Action & {
  score: number;
  confidence: string;
  aiEngine: string;
};

export type NewAction = Omit<Action, 'createdAt' | 'modifiedAt' | 'id'>;

export const isAction = (action: NewAction | Action): action is Action => (action as Action).id !== undefined;

export type ActionFilter = { types: ActionType[]; tags: string[] };

export type ResolvedDynamicParamValue = {
  name: string;
  key?: string;
  tagName: string;
  resolvedValue: string;
};

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
export type AuthenType = 'bearerToken' | 'apiKey' | 'noAuth' | 'basicAuth';

export type NewPolicy = Omit<Policy, 'id' | 'trigger' | 'typeConfigurations'> & {
  trigger: Omit<Trigger, 'name'>;
  typeConfigurations: NewTypeConfiguration[];
};

export type NewTypeConfiguration = Omit<TypeConfiguration, 'runnable'> & {
  runnable: NewRunnable;
};

type NewRunnable = Omit<PolicyRunnable, 'runConfiguration'> & {
  runConfiguration: NewRunConfiguration;
};

type NewRunConfiguration = Omit<RunConfiguration, 'actions'> & {
  actions: NewActionConfiguration[];
};

export type NewActionConfiguration = Omit<ActionConfiguration, 'action'> & {
  action: { id: string };
};

export const isPolicy = (entity: NewPolicy | Policy): entity is Policy => (entity as Policy).id !== undefined;

export type TriggerSpecification =
  | EventSpecificationInfo
  | ApplicationSmartAlertConfigWithMetadata
  | WebsiteAlertConfigWithMetadata
  | GlobalApplicationsSmartAlertConfigWithMetadata
  | MobileAppAlertConfigWithMetadata
  | InfraSmartAlertConfigWithMetadata
  | SyntheticAlertConfigWithMetadata
  | LogAlertConfigWithMetadata
  | ServiceLevelsAlertConfigWithMetadata;

export const isEventSpecification = (item?: TriggerSpecification): item is EventSpecificationInfo =>
  (item as EventSpecificationInfo)?.type !== undefined && (item as EventSpecificationInfo)?.entityType !== undefined;

export const isApplicationSmartAlert = (item?: TriggerSpecification): item is ApplicationSmartAlertConfigWithMetadata =>
  (item as ApplicationSmartAlertConfigWithMetadata)?.applicationId !== undefined;

export const isGlobalApplicationSmartAlert = (
  item?: TriggerSpecification
): item is GlobalApplicationsSmartAlertConfigWithMetadata =>
  (item as GlobalApplicationsSmartAlertConfigWithMetadata)?.applicationIds !== undefined;

export const isMobileAppSmartAlert = (item?: TriggerSpecification): item is MobileAppAlertConfigWithMetadata =>
  (item as MobileAppAlertConfigWithMetadata)?.mobileAppId !== undefined;

export const isWebsiteSmartAlert = (item?: TriggerSpecification): item is WebsiteAlertConfigWithMetadata =>
  (item as WebsiteAlertConfigWithMetadata)?.websiteId !== undefined;

export const isSyntheticsSmartAlert = (item?: TriggerSpecification): item is SyntheticAlertConfigWithMetadata =>
  (item as SyntheticAlertConfigWithMetadata)?.syntheticTestIds !== undefined;

export const isInfraSmartAlert = (item?: TriggerSpecification): item is InfraSmartAlertConfigWithMetadata =>
  (item ?? false) && 'predictiveTrigger' in (item as InfraSmartAlertConfigWithMetadata);

export const isSloSmartAlert = (item?: TriggerSpecification): item is ServiceLevelsAlertConfigWithMetadata =>
  (item as ServiceLevelsAlertConfigWithMetadata)?.sloIds !== undefined;

export type Triggers = {
  customEvent: Result<EventSpecificationInfo[]>;
  builtinEvent: Result<EventSpecificationInfo[]>;
  applicationSmartAlert: Result<ApplicationSmartAlertConfigWithMetadata[]>;
  websiteSmartAlert: Result<WebsiteAlertConfigWithMetadata[]>;
  globalApplicationSmartAlert: Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>;
  mobileAppSmartAlert: Result<MobileAppAlertConfigWithMetadata[]>;
  infraSmartAlert: Result<InfraSmartAlertConfigWithMetadata[]>;
  logSmartAlert: Result<LogAlertConfigWithMetadata[]>;
  syntheticsSmartAlert: Result<SyntheticAlertConfigWithMetadata[]>;
  sloSmartAlert: Result<ServiceLevelsAlertConfigWithMetadata[]>;
};
