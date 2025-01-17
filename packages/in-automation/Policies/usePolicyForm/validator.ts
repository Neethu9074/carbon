/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { ValidationResult } from 'formalistic';

import { Action } from '@instana/types';

import {
  ActionConfigurationFormItems,
  PolicyTypeFormItems,
  ScopeFormItems
} from 'in-automation/Policies/usePolicyForm/types';
import { EXECUTABLE_ACTIONS } from 'in-automation/constants';
import { t } from 'in-i18n';

export function scopeValidator(form: ScopeFormItems): ValidationResult {
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

export function policyTypeValidator(form: PolicyTypeFormItems): ValidationResult {
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

export function canAutomateActionValidator(form: ActionConfigurationFormItems, actions: Action[]): ValidationResult {
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
}

export function parametersValidator(form: ActionConfigurationFormItems, actions: Action[]): ValidationResult {
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
