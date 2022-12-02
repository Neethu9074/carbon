/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { ValidationMessage, ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

export function arrayNotEmptyValidator(arr?: ValidationMessage[]): ValidationResult {
  if (arr == null || arr.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.validators.theValueMustNotBeEmpty')
      }
    ];
  }

  return null;
}
