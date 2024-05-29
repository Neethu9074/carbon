/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field as FormField } from 'formalistic';
import { MapForm } from 'formalistic';

import {
  ApplicationAlertConfigWithMetadata,
  EventSpecificationInfo,
  Policy,
  Trigger,
  TriggerType,
  TypeConfiguration,
  ActionConfiguration,
  RunConfiguration,
  PolicyRunnable,
  TypeConfigurationType,
  ParameterValue,
  WebsiteAlertConfigWithMetadata,
  GlobalApplicationsAlertConfigWithMetadata,
  MobileAppAlertConfigWithMetadata,
  InfraAlertConfigWithMetadata,
  SyntheticAlertConfigWithMetadata,
  LogAlertConfigWithMetadata,
  Result,
  ServiceLevelsAlertConfigWithMetadata
} from 'in-types';
import { Tag } from 'in-automation/ActionCatalog/TagsTable';

export type Triggers = {
  customEvent: Result<EventSpecificationInfo[]>;
  builtinEvent: Result<EventSpecificationInfo[]>;
  applicationSmartAlert: Result<ApplicationAlertConfigWithMetadata[]>;
  websiteSmartAlert: Result<WebsiteAlertConfigWithMetadata[]>;
  globalApplicationSmartAlert: Result<GlobalApplicationsAlertConfigWithMetadata[]>;
  mobileAppSmartAlert: Result<MobileAppAlertConfigWithMetadata[]>;
  infraSmartAlert: Result<InfraAlertConfigWithMetadata[]>;
  logSmartAlert: Result<LogAlertConfigWithMetadata[]>;
  syntheticsSmartAlert: Result<SyntheticAlertConfigWithMetadata[]>;
  sloSmartAlert: Result<ServiceLevelsAlertConfigWithMetadata[]>;
};

export type PolicyFormEntity = Policy | NewPolicy;
export const isPolicy = (entity: PolicyFormEntity): entity is Policy => (entity as Policy).id !== undefined;

export const MANUAL: TypeConfigurationType = 'manual';
export const AUTOMATIC: TypeConfigurationType = 'automatic';
export const isManual = (item: PolicyFormEntity) =>
  item.typeConfigurations.some(typeConfiguration => typeConfiguration.name === MANUAL);
export const isAutomatic = (item: PolicyFormEntity) =>
  item.typeConfigurations.some(typeConfiguration => typeConfiguration.name === AUTOMATIC);

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

type NewActionConfiguration = Omit<ActionConfiguration, 'action'> & {
  action: { id: string };
};

export type TriggerSpecification =
  | EventSpecificationInfo
  | ApplicationAlertConfigWithMetadata
  | WebsiteAlertConfigWithMetadata
  | GlobalApplicationsAlertConfigWithMetadata
  | MobileAppAlertConfigWithMetadata
  | InfraAlertConfigWithMetadata
  | SyntheticAlertConfigWithMetadata
  | LogAlertConfigWithMetadata
  | ServiceLevelsAlertConfigWithMetadata;

export const isEventSpecification = (item?: TriggerSpecification): item is EventSpecificationInfo =>
  (item as EventSpecificationInfo)?.type !== undefined;

export const isApplicationSmartAlert = (item?: TriggerSpecification): item is ApplicationAlertConfigWithMetadata =>
  (item as ApplicationAlertConfigWithMetadata)?.applicationId !== undefined;

export const isGlobalApplicationSmartAlert = (
  item?: TriggerSpecification
): item is GlobalApplicationsAlertConfigWithMetadata =>
  (item as GlobalApplicationsAlertConfigWithMetadata)?.applicationIds !== undefined;

export const isMobileAppSmartAlert = (item?: TriggerSpecification): item is MobileAppAlertConfigWithMetadata =>
  (item as MobileAppAlertConfigWithMetadata)?.mobileAppId !== undefined;

export const isWebsiteSmartAlert = (item?: TriggerSpecification): item is WebsiteAlertConfigWithMetadata =>
  (item as WebsiteAlertConfigWithMetadata)?.websiteId !== undefined;

export const isSyntheticsSmartAlert = (item?: TriggerSpecification): item is SyntheticAlertConfigWithMetadata =>
  (item as SyntheticAlertConfigWithMetadata)?.syntheticTestIds !== undefined;

export const isInfraSmartAlert = (item?: TriggerSpecification): item is InfraAlertConfigWithMetadata =>
  (item ?? false) && 'predictiveTrigger' in (item as InfraAlertConfigWithMetadata);

export const isSloSmartAlert = (item?: TriggerSpecification): item is ServiceLevelsAlertConfigWithMetadata =>
  (item as ServiceLevelsAlertConfigWithMetadata)?.sloIds !== undefined;

export const getTriggerType = (item: TriggerSpecification): TriggerType => {
  if (isApplicationSmartAlert(item)) {
    return 'applicationSmartAlert';
  }
  if (isGlobalApplicationSmartAlert(item)) {
    return 'globalApplicationSmartAlert';
  }
  if (isWebsiteSmartAlert(item)) {
    return 'websiteSmartAlert';
  }
  if (isMobileAppSmartAlert(item)) {
    return 'mobileAppSmartAlert';
  }
  if (isSyntheticsSmartAlert(item)) {
    return 'syntheticsSmartAlert';
  }
  if (isInfraSmartAlert(item)) {
    return 'infraSmartAlert';
  }
  if (isSloSmartAlert(item)) {
    return 'sloSmartAlert';
  }
  if (isEventSpecification(item) && item.type === 'CUSTOM') {
    return 'customEvent';
  }
  if (isEventSpecification(item) && item.type === 'BUILT_IN') {
    return 'builtinEvent';
  }
  return 'logSmartAlert';
};

export const scopeAll = 'all' as const;
export const scopeDfq = 'dfq' as const;
export type ApplyOn = typeof scopeAll | typeof scopeDfq;
type PolicyFormItems = {
  name: FormField<string>;
  description: FormField<string>;
  tags: FormField<Tag[]>;
  triggerType: FormField<TriggerType>;
  triggerId: FormField<string>;
  scope: MapForm<{
    applyOn: FormField<ApplyOn>;
    query: FormField<string>;
  }>;
  action: MapForm<{
    actionId: FormField<string>;
    agentId: FormField<string>;
    parameters: FormField<ParameterValue[]>;
    type: MapForm<{
      manual: FormField<boolean>;
      automatic: FormField<boolean>;
    }>;
  }>;
};
export type PolicyForm = MapForm<PolicyFormItems>;
