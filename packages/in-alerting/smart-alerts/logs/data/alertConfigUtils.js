/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MAX_LABEL_LENGTH } from 'in-alerting/formFieldLengths';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export function titleValidator() {
  return value => {
    if (typeof value === 'string' && value.length > MAX_LABEL_LENGTH) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.valueMustBeShorterThanMaxLengthCharacters', {
            maxLength: MAX_LABEL_LENGTH
          })
        }
      ];
    } else if (value == null || (typeof value === 'string' && isBlank(value))) {
      return [
        {
          severity: 'error',
          message: t('in-services:validators.theValueMustNotBeBlank')
        }
      ];
    }
    return null;
  };
}
