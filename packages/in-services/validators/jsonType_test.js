/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';

import {
  objectValidator,
  arrayValidator,
  booleanValidator,
  stringValidator,
  numberValidator,
  jsonPrimitiveValidator,
  getErrorMessage
} from 'in-services/validators/jsonType';

describe('in-services/validators/jsonType', () => {
  describe('objectValidator must identify', () => {
    it('undefined as okay (because value is missing)', () => expectNoErrors(objectValidator(undefined)));
    it('null as error', () => expectError(objectValidator(null), getErrorMessage('Object', 'null')));
    it('string as error', () => expectError(objectValidator('foo'), getErrorMessage('Object', 'String')));
    it('string as error', () => expectError(objectValidator(''), getErrorMessage('Object', 'String')));
    it('number as error', () => expectError(objectValidator(1.24), getErrorMessage('Object', 'Number')));
    it('number (NaN) as error', () => expectError(objectValidator(NaN), getErrorMessage('Object', 'Number')));
    it('boolean as error', () => expectError(objectValidator(true), getErrorMessage('Object', 'Boolean')));
    it('boolean as error', () => expectError(objectValidator(false), getErrorMessage('Object', 'Boolean')));
    it('Array as error', () => expectError(objectValidator([]), getErrorMessage('Object', 'Array')));
    it('Object as okay', () => expectNoErrors(objectValidator({})));
  });

  describe('arrayValidator must identify', () => {
    it('undefined as okay (because value is missing)', () => expectNoErrors(arrayValidator(undefined)));
    it('null as error', () => expectError(arrayValidator(null), getErrorMessage('Array', 'null')));
    it('string as error', () => expectError(arrayValidator('foo'), getErrorMessage('Array', 'String')));
    it('string as error', () => expectError(arrayValidator(''), getErrorMessage('Array', 'String')));
    it('number as error', () => expectError(arrayValidator(1.24), getErrorMessage('Array', 'Number')));
    it('number (NaN) as error', () => expectError(arrayValidator(NaN), getErrorMessage('Array', 'Number')));
    it('boolean as error', () => expectError(arrayValidator(true), getErrorMessage('Array', 'Boolean')));
    it('boolean as error', () => expectError(arrayValidator(false), getErrorMessage('Array', 'Boolean')));
    it('Array as okay', () => expectNoErrors(arrayValidator([])));
    it('Object as error', () => expectError(arrayValidator({}), getErrorMessage('Array', 'Object')));
  });

  describe('booleanValidator must identify', () => {
    it('undefined as okay (because value is missing)', () => expectNoErrors(booleanValidator(undefined)));
    it('null as error', () => expectError(booleanValidator(null), getErrorMessage('Boolean', 'null')));
    it('string as error', () => expectError(booleanValidator('foo'), getErrorMessage('Boolean', 'String')));
    it('string as error', () => expectError(booleanValidator(''), getErrorMessage('Boolean', 'String')));
    it('number as error', () => expectError(booleanValidator(1.24), getErrorMessage('Boolean', 'Number')));
    it('number (NaN) as error', () => expectError(booleanValidator(NaN), getErrorMessage('Boolean', 'Number')));
    it('boolean as okay', () => expectNoErrors(booleanValidator(true)));
    it('boolean as okay', () => expectNoErrors(booleanValidator(false)));
    it('Array as error', () => expectError(booleanValidator([]), getErrorMessage('Boolean', 'Array')));
    it('Object as error', () => expectError(booleanValidator({}), getErrorMessage('Boolean', 'Object')));
  });

  describe('stringValidator must identify', () => {
    it('undefined as okay (because value is missing)', () => expectNoErrors(stringValidator(undefined)));
    it('null as error', () => expectError(stringValidator(null), getErrorMessage('String', 'null')));
    it('string as okay', () => expectNoErrors(stringValidator('foo')));
    it('string as okay', () => expectNoErrors(stringValidator('')));
    it('number as error', () => expectError(stringValidator(1.24), getErrorMessage('String', 'Number')));
    it('number (NaN) as error', () => expectError(stringValidator(NaN), getErrorMessage('String', 'Number')));
    it('boolean as error', () => expectError(stringValidator(true), getErrorMessage('String', 'Boolean')));
    it('boolean as error', () => expectError(stringValidator(false), getErrorMessage('String', 'Boolean')));
    it('Array as error', () => expectError(stringValidator([]), getErrorMessage('String', 'Array')));
    it('Object as error', () => expectError(stringValidator({}), getErrorMessage('String', 'Object')));
  });

  describe('numberValidator must identify', () => {
    it('undefined as okay (because value is missing)', () => expectNoErrors(numberValidator(undefined)));
    it('null as error', () => expectError(numberValidator(null), getErrorMessage('Number', 'null')));
    it('string as error', () => expectError(numberValidator('foo'), getErrorMessage('Number', 'String')));
    it('string as error', () => expectError(numberValidator(''), getErrorMessage('Number', 'String')));
    it('number as okay', () => expectNoErrors(numberValidator(1.24)));
    it('number (NaN) as error', () => expectError(numberValidator(NaN), 'The provided number is invalid.'));
    it('boolean as error', () => expectError(numberValidator(true), getErrorMessage('Number', 'Boolean')));
    it('boolean as error', () => expectError(numberValidator(false), getErrorMessage('Number', 'Boolean')));
    it('Array as error', () => expectError(numberValidator([]), getErrorMessage('Number', 'Array')));
    it('Object as error', () => expectError(numberValidator({}), getErrorMessage('Number', 'Object')));
  });

  describe('jsonPrimitiveValidator must identify', () => {
    const allowedTypes = 'String|Boolean|Number';
    it('undefined as okay (because value is missing)', () => expectNoErrors(jsonPrimitiveValidator(undefined)));
    it('null as error', () => expectError(jsonPrimitiveValidator(null), getErrorMessage(allowedTypes, 'null')));
    it('string as okay', () => expectNoErrors(jsonPrimitiveValidator('foo')));
    it('string as okay', () => expectNoErrors(jsonPrimitiveValidator('')));
    it('number as okay', () => expectNoErrors(jsonPrimitiveValidator(1.24)));
    it('number (NaN) as error', () => expectError(jsonPrimitiveValidator(NaN), 'The provided number is invalid.'));
    it('boolean as okay', () => expectNoErrors(jsonPrimitiveValidator(true)));
    it('boolean as okay', () => expectNoErrors(jsonPrimitiveValidator(false)));
    it('Array as error', () => expectError(jsonPrimitiveValidator([]), getErrorMessage(allowedTypes, 'Array')));
    it('Object as error', () => expectError(jsonPrimitiveValidator({}), getErrorMessage(allowedTypes, 'Object')));
  });
});

function expectNoErrors(validationMessages) {
  if (!validationMessages) {
    return;
  }
  expect(validationMessages).to.deep.equal([]);
}

function expectError(validationMessages, error) {
  expect(validationMessages).to.deep.equal([
    {
      severity: 'error',
      message: error
    }
  ]);
}
