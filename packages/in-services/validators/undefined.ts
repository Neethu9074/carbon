/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

export function notUndefinedValidator(v: any): ValidationResult {
  if (v === undefined) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeUndefined')
      }
    ];
  }
  return undefined;
}
