/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { jsonValidator } from 'in-synthetics/createTests/validators/jsonValidator';
import { t } from 'in-i18n';

describe('jsonValidator', () => {
  test('validates an Expect JSON, and return an error message if Expect JSON is blank', () => {
    expect(jsonValidator('')).toStrictEqual([
      { invalid: true, message: t('in-services:validators.theValueMustNotBeBlank') }
    ]);
  });

  test('validates an Expect JSON, and return an error message if Expect JSON is undefined', () => {
    expect(jsonValidator()).toStrictEqual([
      { invalid: true, message: t('in-services:validators.theValueMustNotBeUndefined') }
    ]);
  });
  test('validates an Expect JSON, and return an error message if type of Expect JSON is not an object', () => {
    expect(jsonValidator('0')).toStrictEqual([
      { invalid: true, message: t('in-synthetics:dialog.createTest.advancedMode.configStep.jsonRootMustBeAnObject') }
    ]);
  });
  test('validates an Expect JSON, and return an error message if Expect JSON is invaid', () => {
    expect(jsonValidator('{a:"b"}')).toStrictEqual([
      { invalid: true, message: t('in-synthetics:dialog.createTest.advancedMode.configStep.failedToParseInputAsJson') }
    ]);
  });
  test('validates an Expect JSON, and return an empty message if Expect JSON is valid', () => {
    expect(jsonValidator('{"a":"b"}')).toStrictEqual([{ invalid: false, message: '' }]);
  });

  test('validates an Expect JSON, and return an empty message if Expect JSON is empty object', () => {
    expect(jsonValidator('{}')).toStrictEqual([{ invalid: false, message: '' }]);
  });
});
