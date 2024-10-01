/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Action } from '@instana/types';

import { PolicyFormEntity, TriggerSpecification, Triggers } from 'in-automation/Policies/types';

export function getPolicyTriggerFromTriggers(triggers: Triggers, policy: PolicyFormEntity) {
  const { type, id } = policy.trigger;
  return (triggers[type]?.data as TriggerSpecification[])?.find(trigger => trigger.id === id);
}

export function getActionConfigurationFromPolicy(policy: PolicyFormEntity) {
  return policy.typeConfigurations[0].runnable.runConfiguration.actions[0];
}

export function getPolicyActionFromActions(actions: Action[], policy: PolicyFormEntity) {
  const { id } = getActionConfigurationFromPolicy(policy).action;
  return actions.find(action => action.id === id);
}
