/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isBlank } from 'in-services/util/string';

export function stringMaxLengthValidator(maxLength = 128) {
  return str => {
    if (typeof str === 'string' && str.length > maxLength) {
      return [
        {
          severity: 'error',
          message: `Value must be shorter than ${maxLength} characters.`
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
        message: 'The value must not be blank.'
      }
    ];
  }

  return null;
}
