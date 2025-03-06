/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-ignore
import { titleValidator } from 'in-alerting/smart-alerts/synthetics/data/alertConfigUtils';
import { MAX_LABEL_LENGTH } from 'in-alerting/formFieldLengths';
import { t } from 'in-i18n';

describe('titleValidator', () => {
  it('should return an error if the value exceeds MAX_LABEL_LENGTH', () => {
    const validate = titleValidator(true);
    const result = validate('A'.repeat(MAX_LABEL_LENGTH + 1));
    expect(result).toEqual([
      {
        severity: 'error',
        message: t('in-services:validators.valueMustBeShorterThanMaxLengthCharacters', {
          maxLength: MAX_LABEL_LENGTH
        })
      }
    ]);
  });

  it('should return an error if the value is null or blank', () => {
    const validate = titleValidator(true);
    expect(validate(null)).toEqual([
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeBlank')
      }
    ]);
    expect(validate('')).toEqual([
      {
        severity: 'error',
        message: t('in-services:validators.theValueMustNotBeBlank')
      }
    ]);
  });

  it('should return null for a valid value', () => {
    const validate = titleValidator(true);
    expect(validate('Valid Title')).toBeNull();
  });
});
