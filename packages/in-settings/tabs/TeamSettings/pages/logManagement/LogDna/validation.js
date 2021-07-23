/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function validLogDnaId(str) {
  let digits = /^[a-zA-Z0-9-]+$/;
  if (!isBlank(str) && !digits.test(str)) {
    return [
      {
        severity: 'error',
        message: t('in-settings:tabs.invalidLogDnaId')
      }
    ];
  }

  return null;
}
