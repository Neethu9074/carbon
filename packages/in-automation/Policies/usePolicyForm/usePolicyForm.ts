/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm } from 'formalistic';
import { useContext, useState } from 'react';

import { Action, TriggerType } from '@instana/types';

import {
  canAutomateActionValidator,
  parametersValidator,
  policyTypeValidator,
  scopeValidator
} from 'in-automation/Policies/usePolicyForm/validator';
import {
  getActionConfigurationFromPolicy,
  getPolicyTriggerFromTriggers,
  isAutomatic,
  isManual
} from 'in-automation/utils/policy';
import { TriggerDetailsProps } from 'in-automation/AutomationCard/CreatePolicyButton';
import { ApplyOn, PolicyForm } from 'in-automation/Policies/usePolicyForm/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { SCOPE } from 'in-automation/Policies/usePolicyForm/constants';
import { FormContext } from 'in-components/form/binding/FormContext';
import { notBlankValidator } from 'in-services/validators/string';
import { PolicyFormEntity } from 'in-automation/Policies/types';
import { isPolicy, Triggers } from 'in-automation/types';
import { POLICY_TYPE } from 'in-automation/constants';

function parsePolicy(policy: PolicyFormEntity) {
  if (!isPolicy(policy)) {
    return {
      name: '',
      description: '',
      actionId: '',
      agentId: '',
      applyOn: SCOPE.ALL,
      query: '',
      inputParameterValues: [],
      tags: [],
      manual: false,
      automatic: false
    };
  }
  const typeConfiguration = policy.typeConfigurations.find(
    typeConfiguration => typeConfiguration.name === (isManual(policy) ? POLICY_TYPE.MANUAL : POLICY_TYPE.AUTOMATIC)
  )!;

  const { agentId = '', inputParameterValues = [] } = getActionConfigurationFromPolicy(policy);

  return {
    name: policy.name,
    description: policy.description ?? '',
    actionId: typeConfiguration?.runnable.runConfiguration.actions[0]?.action?.id,
    agentId,
    applyOn: typeConfiguration.condition?.query ? SCOPE.DFQ : SCOPE.ALL,
    query: typeConfiguration.condition?.query ?? '',
    inputParameterValues,
    tags: policy.tags ?? [],
    manual: isManual(policy),
    automatic: isAutomatic(policy)
  };
}

function parseTrigger(
  policy: PolicyFormEntity,
  triggers: Triggers,
  triggerDetails?: TriggerDetailsProps
): { triggerId: string; triggerType: TriggerType } {
  const trigger = getPolicyTriggerFromTriggers(triggers, policy);
  if (triggerDetails && triggerDetails.triggerId && triggerDetails.triggerType) {
    return triggerDetails;
  }
  if (!trigger) {
    return {
      triggerType: 'builtinEvent',
      triggerId: ''
    };
  }

  return {
    triggerType: policy.trigger.type,
    triggerId: policy.trigger.id
  };
}

function createPolicyFormDefinition(
  policy: PolicyFormEntity,
  actions: Action[],
  triggers: Triggers,
  triggerDetails?: TriggerDetailsProps
): PolicyForm {
  const { name, description, actionId, agentId, applyOn, query, inputParameterValues, tags, manual, automatic } =
    parsePolicy(policy);
  const { triggerType, triggerId } = parseTrigger(policy, triggers, triggerDetails);

  return createMapForm({
    items: {
      name: createField({
        value: name,
        validator: notBlankValidator
      }),
      description: createField({
        value: description,
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
            value: actionId
          }),
          agentId: createField({
            value: agentId
          }),
          type: createMapForm({
            items: {
              manual: createField({
                value: manual
              }),
              automatic: createField({
                value: automatic
              })
            },
            validator: policyTypeValidator
          }),
          isActionPreSelected: createField({
            value: false
          })
        },
        validator: composeAndShortCircuitOnError(
          form => notBlankValidator(form.actionId.value),
          form => canAutomateActionValidator(form, actions),
          form => parametersValidator(form, actions)
        )
      }),
      triggerType: createField({
        value: triggerType,
        validator: notBlankValidator
      }),
      triggerId: createField({
        value: triggerId,
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
        validator: scopeValidator
      })
    }
  });
}

export default function usePolicyForm(
  policy: PolicyFormEntity,
  actions: Action[],
  triggers: Triggers,
  triggerDetails?: TriggerDetailsProps
) {
  return useState(createPolicyFormDefinition(policy, actions, triggers, triggerDetails));
}

interface PolicyFormContext {
  form: PolicyForm;
  setForm: React.Dispatch<React.SetStateAction<PolicyForm>>;
}

export function usePolicyFormContext() {
  const context = useContext(FormContext);

  if (context === undefined) {
    throw new Error('Must be used inside Form');
  }

  return context as PolicyFormContext;
}
