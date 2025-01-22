/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

import { ParameterValue, TriggerType } from '@instana/types';

import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';

export type ApplyOn = (typeof SCOPE)[keyof typeof SCOPE];

export type ScopeFormItems = {
  applyOn: Field<ApplyOn>;
  query: Field<string>;
};

export type PolicyTypeFormItems = {
  manual: Field<boolean>;
  automatic: Field<boolean>;
};

export type ActionConfigurationFormItems = {
  actionId: Field<string>;
  agentId: Field<string>;
  parameters: Field<ParameterValue[]>;
  type: MapForm<PolicyTypeFormItems>;
};

export type PolicyFormItems = {
  name: Field<string>;
  description: Field<string>;
  tags: Field<string[]>;
  triggerType: Field<TriggerType>;
  triggerId: Field<string>;
  scope: MapForm<ScopeFormItems>;
  action: MapForm<ActionConfigurationFormItems>;
};

export type PolicyForm = MapForm<PolicyFormItems>;
