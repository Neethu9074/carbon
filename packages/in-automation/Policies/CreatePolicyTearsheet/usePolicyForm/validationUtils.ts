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

