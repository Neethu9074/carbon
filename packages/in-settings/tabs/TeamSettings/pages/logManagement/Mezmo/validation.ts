/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ValidationResult } from 'formalistic';

import { t } from 'in-i18n';

export function validMezmoId(str: string): ValidationResult {
  let alphaNumeric = /^[a-zA-Z0-9-]+$/;
  if (!alphaNumeric.test(str)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.invalidMezmoId')
      }
    ];
  }

  return null;
}
