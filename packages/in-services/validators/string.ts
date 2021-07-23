/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function stringMaxLengthValidator(maxLength = 128) {
  return str => {
    if (typeof str === 'string' && str.length > maxLength) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeShorterThanMaxLengthCharacters', { maxLength: maxLength })
        }
      ];
    }
    return null;
  };
}

// A variation to formalistic's default notBlankValidator which does
// not break for non-string types. Useful to validate fields which
// can either contain strings/numbers/boolean values.
export function notBlankValidator(str) {
  if (str == null || (typeof str === 'string' && isBlank(str))) {
    return [
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeBlank')
      }
    ];
  }

  return null;
}
