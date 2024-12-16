/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Policy, Action, ActionConfiguration } from '@instana/types';

import { NewActionConfiguration, NewPolicy, TriggerSpecification, Triggers } from 'in-automation/types';
import { POLICY_TYPE } from 'in-automation/constants';

export const isManual = (item: Policy | NewPolicy) =>
  item.typeConfigurations.some(typeConfiguration => typeConfiguration.name === POLICY_TYPE.MANUAL);
export const isAutomatic = (item: Policy | NewPolicy) =>
  item.typeConfigurations.some(typeConfiguration => typeConfiguration.name === POLICY_TYPE.AUTOMATIC);

export function getActionConfigurationFromPolicy(policy: Policy): ActionConfiguration;
export function getActionConfigurationFromPolicy(policy: NewPolicy): NewActionConfiguration;
export function getActionConfigurationFromPolicy(policy: Policy | NewPolicy) {
  return policy.typeConfigurations[0].runnable.runConfiguration.actions[0];
}

export function getPolicyTriggerFromTriggers(triggers: Triggers, policy: Policy | NewPolicy) {
  const { type, id } = policy.trigger;
  return (triggers[type]?.data as TriggerSpecification[])?.find(trigger => trigger.id === id);
}

export function getPolicyActionFromActions(actions: Action[], policy: Policy | NewPolicy) {
  const { id } = getActionConfigurationFromPolicy(policy).action;
  return actions.find(action => action.id === id);
}
