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
  SyntheticAlertConfigWithMetadata,
  ServiceLevelsAlertConfigWithMetadata,
  Result
} from '@instana/types';

import {
  ApplicationSmartAlertConfigWithMetadata,
  GlobalApplicationsSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/applications/data/applicationAlertConfigTypes';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { LogSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/logs/form/logAlertConfigTypes';

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

export const isNoAuth = (authen: Authen): authen is NoAuth => authen.type === 'noAuth';

export interface BasicAuth {
  type: 'basicAuth';
  username: string;
  password: string;
}

export const isBasicAuth = (authen: Authen): authen is BasicAuth => authen.type === 'basicAuth';

export interface BearerAuth {
  type: 'bearerToken';
  bearerToken: string;
}

export const isBearerAuth = (authen: Authen): authen is BearerAuth => authen.type === 'bearerToken';

export interface ApiKeyAuth {
  type: 'apiKey';
  apiKey: string;
  apiKeyValue: string;
  apiKeyAddTo: string;
}

export const isApiKeyAuth = (authen: Authen): authen is ApiKeyAuth => authen.type === 'apiKey';

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
  | WebsiteSmartAlertConfigWithMetadata
  | GlobalApplicationsSmartAlertConfigWithMetadata
  | MobileAppSmartAlertConfigWithMetadata
  | InfraSmartAlertConfigWithMetadata
  | SyntheticAlertConfigWithMetadata
  | LogSmartAlertConfigWithMetadata
  | ServiceLevelsAlertConfigWithMetadata;

export const isEventSpecification = (item?: TriggerSpecification): item is EventSpecificationInfo =>
  (item as EventSpecificationInfo)?.type !== undefined && (item as EventSpecificationInfo)?.entityType !== undefined;

export const isApplicationSmartAlert = (item?: TriggerSpecification): item is ApplicationSmartAlertConfigWithMetadata =>
  (item as ApplicationSmartAlertConfigWithMetadata)?.applicationId !== undefined;

export const isGlobalApplicationSmartAlert = (
  item?: TriggerSpecification
): item is GlobalApplicationsSmartAlertConfigWithMetadata =>
  (item as GlobalApplicationsSmartAlertConfigWithMetadata)?.applicationIds !== undefined;

export const isMobileAppSmartAlert = (item?: TriggerSpecification): item is MobileAppSmartAlertConfigWithMetadata =>
  (item as MobileAppSmartAlertConfigWithMetadata)?.mobileAppId !== undefined;

export const isWebsiteSmartAlert = (item?: TriggerSpecification): item is WebsiteSmartAlertConfigWithMetadata =>
  (item as WebsiteSmartAlertConfigWithMetadata)?.websiteId !== undefined;

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
  websiteSmartAlert: Result<WebsiteSmartAlertConfigWithMetadata[]>;
  globalApplicationSmartAlert: Result<GlobalApplicationsSmartAlertConfigWithMetadata[]>;
  mobileAppSmartAlert: Result<MobileAppSmartAlertConfigWithMetadata[]>;
  infraSmartAlert: Result<InfraSmartAlertConfigWithMetadata[]>;
  logSmartAlert: Result<LogSmartAlertConfigWithMetadata[]>;
  syntheticsSmartAlert: Result<SyntheticAlertConfigWithMetadata[]>;
  sloSmartAlert: Result<ServiceLevelsAlertConfigWithMetadata[]>;
};
