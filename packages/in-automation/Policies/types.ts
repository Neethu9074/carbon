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
  ParameterValue
} from 'in-types';
import { Tag } from 'in-automation/ActionCatalog/TagsTable';

export type Triggers = {
  customEvent: EventSpecificationInfo[];
  builtinEvent: EventSpecificationInfo[];
  applicationSmartAlert: ApplicationAlertConfigWithMetadata[];
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

export type TriggerSpecification = EventSpecificationInfo | ApplicationAlertConfigWithMetadata;
export const isEventSpecification = (item: TriggerSpecification): item is EventSpecificationInfo =>
  (item as EventSpecificationInfo).type !== undefined;

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
