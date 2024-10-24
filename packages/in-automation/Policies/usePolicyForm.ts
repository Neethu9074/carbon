/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';
import { useState } from 'react';

import { Action, ParameterValue, TriggerType } from '@instana/types';

import {
  getActionConfigurationFromPolicy,
  getPolicyTriggerFromTriggers,
  isAutomatic,
  isManual
} from 'in-automation/utils/policy';
import { isPolicy, NewTypeConfiguration, NewPolicy, Triggers } from 'in-automation/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { EXECUTABLE_ACTIONS, POLICY_TYPE } from 'in-automation/constants';
import { notBlankValidator } from 'in-services/validators/string';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { t } from 'in-i18n';

export const scopeAll = 'all' as const;
export const scopeDfq = 'dfq' as const;
export type ApplyOn = typeof scopeAll | typeof scopeDfq;

type PolicyFormItems = {
  name: Field<string>;
  description: Field<string>;
  tags: Field<string[]>;
  triggerType: Field<TriggerType>;
  triggerId: Field<string>;
  scope: MapForm<{
    applyOn: Field<ApplyOn>;
    query: Field<string>;
  }>;
  action: MapForm<{
    actionId: Field<string>;
    agentId: Field<string>;
    parameters: Field<ParameterValue[]>;
    type: MapForm<{
      manual: Field<boolean>;
      automatic: Field<boolean>;
    }>;
  }>;
};

export type PolicyForm = MapForm<PolicyFormItems>;

export function getPolicyFromForm(form: PolicyForm) {
  const policySpecification: NewPolicy = {
    name: form.get('name').value,
    description: form.get('description').value,
    tags: form.get('tags').value,
    trigger: {
      type: form.get('triggerType').value,
      id: form.get('triggerId').value
    },
    typeConfigurations: [] as NewTypeConfiguration[]
  };

  const query = form.get('scope').get('applyOn').value === scopeAll ? undefined : form.get('scope').get('query').value;

  const action = form.get('action');
  const typeConfiguration = {
    condition: {
      query
    },
    runnable: {
      id: action.get('actionId').value,
      type: 'action' as const,
      runConfiguration: {
        actions: [
          {
            action: { id: action.get('actionId').value },
            agentId: action.get('agentId').value,
            inputParameterValues: action.get('parameters').value
          }
        ]
      }
    }
  };

  if (action.get('type').get('manual').value) {
    policySpecification.typeConfigurations.push({
      name: POLICY_TYPE.MANUAL,
      ...typeConfiguration
    });
  }

  if (action.get('type').get('automatic').value) {
    policySpecification.typeConfigurations.push({
      name: POLICY_TYPE.AUTOMATIC,
      ...typeConfiguration
    });
  }

  return policySpecification;
}

function parsePolicy(policy: PolicyFormEntity) {
  if (!isPolicy(policy)) {
    return {
      actionId: '',
      agentId: '',
      applyOn: scopeAll,
      query: '',
      inputParameterValues: [],
      tags: []
    };
  }
  const typeConfiguration = policy.typeConfigurations.find(
    typeConfiguration => typeConfiguration.name === (isManual(policy) ? POLICY_TYPE.MANUAL : POLICY_TYPE.AUTOMATIC)
  )!;

  const { agentId = '', inputParameterValues = [] } = getActionConfigurationFromPolicy(policy);

  return {
    actionId: typeConfiguration.runnable.id,
    agentId,
    applyOn: typeConfiguration.condition?.query ? scopeDfq : scopeAll,
    query: typeConfiguration.condition?.query ?? '',
    inputParameterValues,
    tags: policy.tags ?? []
  };
}

function createPolicyFormDefinition(policy: PolicyFormEntity, actions: Action[], triggers: Triggers) {
  const { actionId, agentId, applyOn, query, inputParameterValues, tags } = parsePolicy(policy);
  const action = actions.find(action => action.id === actionId);
  const trigger = getPolicyTriggerFromTriggers(triggers, policy);
  const form: PolicyForm = createMapForm({
    items: {
      name: createField({
        value: policy.name,
        validator: notBlankValidator
      }),
      description: createField({
        value: policy.description ?? '',
        validator: notBlankValidator
      }),
      tags: createField({
        value: tags
      }),

      action: createMapForm({
        items: {
          parameters: createField({
            value: inputParameterValues
          }),
          actionId: createField({
            value: action ? actionId : ''
          }),
          agentId: createField({
            value: agentId
          }),
          type: createMapForm({
            items: {
              manual: createField({
                value: isManual(policy)
              }),
              automatic: createField({
                value: isAutomatic(policy)
              })
            },
            validator: form => {
              if (!form.manual.value && !form.automatic.value) {
                return [
                  {
                    severity: 'error',
                    message: t('in-automation:policies.atLeastOneOfTheTwoMustBeSelected')
                  }
                ];
              }
              return null;
            }
          })
        },
        validator: composeAndShortCircuitOnError(
          form => notBlankValidator(form.actionId.value),
          form => {
            const action = actions.find(action => action.id === form.actionId.value);
            const isExecutableAction = action ? EXECUTABLE_ACTIONS.includes(action.type) : false;

            if (!isExecutableAction && form.type.get('automatic').value) {
              return [
                {
                  severity: 'error',
                  message: t('in-automation:policies.docLinkAndManualCantBeAutomated')
                }
              ];
            }
            return null;
          },
          form => {
            const action = actions.find(action => action.id === form.actionId.value);
            const emptyRequiredParam =
              action?.inputParameters?.reduce((acc, parameter) => {
                // If the accumulator already found a missing parameter or the current parameter is hidden, skip further checks
                if (acc || parameter.hidden) {
                  return acc;
                }
                const formValue = form.parameters.value.find(p => p.name === parameter.name);
                // If the parameter is required, not provided in the form, and not dynamic, return true (indicating a missing required parameter)
                if (parameter.required && !formValue && parameter.type !== 'dynamic') {
                  return true;
                }
                // Otherwise, return the current state of the accumulator
                return acc;
              }, false) ?? false;

            if (form.type.get('automatic').value && (form.agentId.value === '' || emptyRequiredParam)) {
              return [
                {
                  severity: 'error',
                  message:
                    'Automated actions must have all parameters set and the target agent selected. Select Edit action configuration to set them.'
                }
              ];
            }
            return null;
          }
        )
      }),
      triggerType: createField({
        value: trigger ? policy.trigger.type : 'builtinEvent',
        validator: notBlankValidator
      }),
      triggerId: createField({
        value: trigger ? policy.trigger.id : '',
        validator: notBlankValidator
      }),

      scope: createMapForm({
        items: {
          applyOn: createField<ApplyOn>({
            value: applyOn
          }),
          query: createField({
            value: query
          })
        },
        validator: form => {
          if (form.applyOn.value === 'dfq' && form.query.value === '') {
            return [
              {
                severity: 'error',
                message: t('in-automation:theValueMustNotBeBlank')
              }
            ];
          }
          return null;
        }
      })
    }
  });
  return form;
}

export default function usePolicyForm(policy: PolicyFormEntity, actions: Action[], triggers: Triggers) {
  return useState(createPolicyFormDefinition(policy, actions, triggers));
}
