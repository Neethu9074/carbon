/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import type { Item } from 'formalistic';
import { PolicyForm } from 'in-automation/Policies/CreatePolicyTearsheet/usePolicyForm/types';

export function isFieldValid(field: Item): boolean {
  return field.valid || !field.touched;
}

export function getValidationMessage(item: Item): string | undefined {
  const [validationMessage] = item.messages;
  if (validationMessage) return validationMessage.message;
  return undefined;
}

export function areFieldsValid(form: PolicyForm, fieldsToValidate: string[][]) {
  return fieldsToValidate.every(fieldPath => {
    const field = form.getIn(fieldPath as any);
    return field ? isFieldValid(field) : false;
  });
}
