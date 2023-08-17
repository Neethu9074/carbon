/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { minValidator, numericValidator } from 'in-services/validators/number';
import { t } from 'in-i18n';

export const inputNotUndefinedValidator = (v: any): ValidationResult => {
  if (v === undefined) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeBlank')
      }
    ];
  }
  return undefined;
};

export const thresholdFieldValidator = composeAndShortCircuitOnError(inputNotUndefinedValidator, numericValidator, v =>
  minValidator(1)(Number(v))
);
