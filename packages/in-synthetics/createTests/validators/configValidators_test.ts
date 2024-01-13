/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  mainFileNameValidator,
  onlyUniqueKeyNames,
  regExpValidator,
  requestHeaderNameValidator,
  requestHeaderValueValidator,
  statusCodeValidator
} from 'in-synthetics/createTests/validators/configValidators';
import { t } from 'in-i18n';

describe('statusCodeValidator', () => {
  test('validates an Expect Status, and return an error message if Expect Status is invalid', () => {
    expect(statusCodeValidator('2000')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.mustBeValidHttpReturnCode')
      }
    ]);
    expect(statusCodeValidator('2000/')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.mustBeValidHttpReturnCode')
      }
    ]);
    expect(statusCodeValidator('ab/')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.mustBeValidHttpReturnCode')
      }
    ]);
    expect(statusCodeValidator('200')).toStrictEqual(undefined);
    expect(statusCodeValidator('400')).toStrictEqual(undefined);
  });
});

describe('regExpValidator', () => {
  test('validates an Expect Match, and return an error message if Expect Match is invalid', () => {
    expect(regExpValidator('ab')).toStrictEqual(undefined);
    expect(regExpValidator('ab/')).toStrictEqual(undefined);
  });
});

describe('requestHeaderNameValidator', () => {
  test('validates a Header name, and return an error message if Header name is invalid', () => {
    expect(requestHeaderNameValidator('ab~')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.shouldBeValidHeaderName')
      }
    ]);
    expect(requestHeaderNameValidator('ab`')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.shouldBeValidHeaderName')
      }
    ]);
    expect(requestHeaderNameValidator('ab')).toStrictEqual(undefined);
  });
});

describe('requestHeaderValueValidator', () => {
  test('validates a Header value, and return an error message if Header value is invalid', () => {
    expect(requestHeaderValueValidator('abæ')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.shouldBeValidHeaderValue')
      }
    ]);
    expect(requestHeaderValueValidator('ab`')).toStrictEqual(undefined);
    expect(requestHeaderValueValidator('ab')).toStrictEqual(undefined);
  });
});

describe('onlyUniqueKeyNames', () => {
  test('validates a Header name, and return an error message if Header name is not unique', () => {
    const headers1 = [
      {
        id: '3VGuGJ4tiA9GbLhQ',
        key: 'header1',
        value: 'value1',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: '3CA_SgwjBMeqQisW',
        key: 'header1',
        value: 'value1',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: 'wNAmZKEFql7lsX4Z',
        key: 'header3',
        value: 'value3',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      }
    ];
    const headers2 = [
      {
        id: '3VGuGJ4tiA9GbLhQ',
        key: 'header1',
        value: 'value1',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: '3CA_SgwjBMeqQisW',
        key: 'header2',
        value: 'value2',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: 'wNAmZKEFql7lsX4Z',
        key: 'header3',
        value: 'value3',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      }
    ];
    expect(onlyUniqueKeyNames(headers1, 'headers')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.headerNameMustBeUnique')
      }
    ]);
    expect(onlyUniqueKeyNames(headers2, 'headers')).toStrictEqual(undefined);
  });

  test('validates a Custom property name, and return an error message if Custom property name is not unique', () => {
    const property1 = [
      {
        id: '3VGuGJ4tiA9GbLhQ',
        key: 'property1',
        value: 'value1',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: '3CA_SgwjBMeqQisW',
        key: 'property1',
        value: 'value1',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: 'wNAmZKEFql7lsX4Z',
        key: 'property3',
        value: 'value3',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      }
    ];
    const property2 = [
      {
        id: '3VGuGJ4tiA9GbLhQ',
        key: 'property1',
        value: 'value1',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: '3CA_SgwjBMeqQisW',
        key: 'property2',
        value: 'value2',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      },
      {
        id: 'wNAmZKEFql7lsX4Z',
        key: 'property3',
        value: 'value3',
        error: {
          name: { invalid: false, message: '' },
          value: { invalid: false, message: '' }
        }
      }
    ];
    expect(onlyUniqueKeyNames(property1, 'properties')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.customProperties.propertyNameMustBeUnique')
      }
    ]);
    expect(onlyUniqueKeyNames(property2, 'properties')).toStrictEqual(undefined);
  });
});

describe('mainFileNameValidator', () => {
  test('validates the main file name of zip file, and return an error message if file name is invalid', () => {
    const zipFile = { name: 'sample.zip', files: ['index.js', 'lib/request1.js', 'lib/request2.js'] };
    expect(mainFileNameValidator(zipFile, 'index1.js')).toStrictEqual([
      {
        severity: 'error',
        message: t('in-synthetics:dialog.createTest.advancedMode.configStep.invalidMainFileName')
      }
    ]);
    expect(mainFileNameValidator(zipFile, 'lib/request1.js')).toStrictEqual(undefined);
    expect(mainFileNameValidator(zipFile, 'index.js')).toStrictEqual(undefined);
  });
});
