/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ValidationResult } from 'formalistic';

import { notUndefinedValidator } from 'in-services/validators/undefined';
import { notBlankValidator } from 'in-services/validators/string';
import { t } from 'in-i18n';

export function jsonValidator(value?: string) {
  const valueNotBlank: ValidationResult = notBlankValidator(value);
  const valueUndefined: ValidationResult = notUndefinedValidator(value);
  if (valueUndefined) {
    return [{ invalid: true, message: valueUndefined[0].message! }];
  } else if (valueNotBlank) {
    return [{ invalid: true, message: valueNotBlank[0].message! }];
  } else {
    let config: {};
    try {
      config = JSON.parse(value!);
      if (!config || typeof config !== 'object') {
        return [
          {
            invalid: true,
            message: t('in-synthetics:dialog.createTest.advancedMode.configStep.jsonRootMustBeAnObject')
          }
        ];
      } else {
        return [{ invalid: false, message: '' }];
      }
    } catch {
      return [
        {
          invalid: true,
          message: t('in-synthetics:dialog.createTest.advancedMode.configStep.failedToParseInputAsJson')
        }
      ];
    }
  }
}
