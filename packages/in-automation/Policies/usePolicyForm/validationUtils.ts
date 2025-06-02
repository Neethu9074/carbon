/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';

import {
  ActionConfigurationFormItems,
  PolicyForm,
  PolicyTypeFormItems
} from 'in-automation/Policies/usePolicyForm/types';
import { t } from 'in-i18n';

function isFieldValid(
  field: Field<any> | MapForm<ActionConfigurationFormItems> | MapForm<PolicyTypeFormItems>
): boolean {
  return field.valid || !field.touched;
}

export const isMetadataValid = (form: PolicyForm): boolean =>
  isFieldValid(form.get('name')) && isFieldValid(form.get('description'));

export const isTriggerConfigurationValid = (form: PolicyForm): boolean =>
  isFieldValid(form.get('triggerId')) && isFieldValid(form.getIn(['action', 'type']));

export const isActionConfigurationValid = (form: PolicyForm): boolean => isFieldValid(form.get('action'));

export const generateNavItems = (form?: PolicyForm) => {
  return [
    {
      label: t('in-automation:policies.policyDetails'),
      scrollId: '1-action-details',
      title: t('in-automation:policies.policyDetails'),
      content: null,
      valid: form ? isMetadataValid(form) : true
    },
    {
      label: t('in-automation:policies.triggerConfiguration'),
      scrollId: '2-trigger-configuration',
      title: t('in-automation:policies.actionConfiguration'),
      content: null,
      valid: form ? isTriggerConfigurationValid(form) : true
    },
    {
      label: t('in-automation:policies.actionConfiguration'),
      scrollId: '3-action-configuration',
      title: t('in-automation:policies.actionConfiguration'),
      content: null,
      valid: form ? isActionConfigurationValid(form) : true
    }
  ];
};
