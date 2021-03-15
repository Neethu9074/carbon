/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { t } from 'in-i18n';

export function notUndefinedValidator(v) {
  if (v === undefined) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeUndefined')
      }
    ];
  }
}
