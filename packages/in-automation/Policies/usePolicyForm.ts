/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm } from 'formalistic';
import { useEffect, useState } from 'react';

import { generateUniqueShortId } from '@instana/utils';

import {
  AUTOMATIC,
  ApplyOn,
  MANUAL,
  NewPolicy,
  NewTypeConfiguration,
  PolicyForm,
  PolicyFormEntity,
  Triggers,
  isAutomatic,
  isManual,
  isPolicy,
  scopeAll,
  scopeDfq
} from 'in-automation/Policies/types';
import { isAnsible, isScript, isWebhook, isGithub, isGitlab, isJira } from 'in-automation/ActionCatalog/shared';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { notBlankValidator } from 'in-services/validators/string';
import { isLoading } from 'in-services/util/result';
import { Action } from 'in-types';
import { t } from 'in-i18n';

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
    typeConfiguration => typeConfiguration.name === (isManual(policy) ? MANUAL : AUTOMATIC)
  )!;

  return {
    actionId: typeConfiguration.runnable.id,
    agentId: typeConfiguration.runnable.runConfiguration.actions[0].agentId ?? '',
    applyOn: typeConfiguration?.condition?.query ? scopeDfq : scopeAll,
    query: typeConfiguration?.condition?.query ?? '',
    inputParameterValues: typeConfiguration.runnable.runConfiguration.actions[0].inputParameterValues ?? [],
    tags: policy.tags?.map(tag => ({ value: tag, id: generateUniqueShortId() })) ?? []
  };
}

export function getPolicyFromForm(form: PolicyForm) {
  const policySpecification: NewPolicy = {
    name: form.get('name').value,
    description: form.get('description').value,
    tags: form.get('tags').value.map(tag => tag.value),
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
      name: MANUAL,
      ...typeConfiguration
    });
  }

  if (action.get('type').get('automatic').value) {
    policySpecification.typeConfigurations.push({
      name: AUTOMATIC,
      ...typeConfiguration
    });
  }

  return policySpecification;
}

function createPolicyFormDefinition(policy: PolicyFormEntity, actions: Action[], triggers: Triggers) {
  const { actionId, agentId, applyOn, query, inputParameterValues, tags } = parsePolicy(policy);
  const action = actions.find(action => action.id === actionId);
  // @ts-expect-error
  const triggerItem = triggers?.[policy.trigger.type]?.data?.find(trigger => trigger.id === policy.trigger.id);
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
        value: tags,
        validator: tags => {
          const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || tag.value === '', false);
          if (hasBlankTags) {
            return [
              {
                severity: 'error',
                message: t('in-automation:theValueMustNotBeBlank')
              }
            ];
          }
          return null;
        }
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
            const executableAction =
              isScript(action?.type) ||
              isWebhook(action?.type) ||
              isAnsible(action?.type) ||
              isGithub(action?.type) ||
              isGitlab(action?.type) ||
              isJira(action?.type);

            if (!executableAction && form.type.get('automatic').value) {
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
        value: triggerItem ? policy.trigger.type : 'builtinEvent',
        validator: notBlankValidator
      }),
      triggerId: createField({
        value: triggerItem ? policy.trigger.id : '',
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

export default function usePolicyForm(
  policy: PolicyFormEntity | undefined,
  actions: Action[] | undefined,
  triggers: Triggers
) {
  const [form, setForm] = useState<PolicyForm | null>(null);
  useEffect(() => {
    if (policy && actions && Object.values(triggers).every(trigger => !isLoading(trigger)) && !form) {
      setForm(createPolicyFormDefinition(policy, actions, triggers));
    }
  }, [policy, actions, triggers, form]);
  return [form, setForm] as const;
}
