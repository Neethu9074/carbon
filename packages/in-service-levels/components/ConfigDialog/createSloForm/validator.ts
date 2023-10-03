/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { SloTimeWindowFields } from 'in-service-levels/components/ConfigDialog/createSloForm/types';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { minValidator, numericValidator } from 'in-services/validators/number';
import { dateValidator, timeValidator } from 'in-services/validators/date';
import { notBlankValidator } from 'in-services/validators/string';
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

export function validateTimeWindow(timeWindow: SloTimeWindowFields): ValidationResult {
  const { duration, durationUnit } = timeWindow;
  if (!duration || !durationUnit || !duration.valid || !durationUnit.valid) {
    return null;
  }
  if (durationUnit.value === 'day' && duration.value > 31) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorTimeWindowDay')
      }
    ];
  } else if (durationUnit.value === 'week' && duration.value > 4) {
    return [
      {
        severity: 'error',
        message: t('in-service-levels:createSloDialog.errorTimeWindowWeek')
      }
    ];
  }
  return null;
}

export const targetFieldValidator = composeAndShortCircuitOnError(inputNotUndefinedValidator);
export const timeFieldValidator = composeAndShortCircuitOnError(timeValidator, notBlankValidator);
export const dateFieldValidator = composeAndShortCircuitOnError(notBlankValidator, dateValidator);

export const timeWindowValidator = composeAndShortCircuitOnError(validateTimeWindow);
