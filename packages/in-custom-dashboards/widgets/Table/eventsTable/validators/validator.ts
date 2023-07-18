/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

export function arrayNotEmptyValidator(arr: string[]): ValidationResult {
  if (arr.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-custom-dashboards:widgets.table.form.validators.theValueMustNotBeEmpty')
      }
    ];
  }

  return null;
}
