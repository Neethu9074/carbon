/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { ValidationResult } from 'formalistic';

import { SyntheticDatacenter } from '@instana/types';

import { t } from 'in-i18n';

export function datacentersNotEmptyValidator(arr?: SyntheticDatacenter[]): ValidationResult {
  if (arr == null || arr.length === 0) {
    return [
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createLocation.validators.theValueMustNotBeEmpty')
      }
    ];
  }

  return null;
}
