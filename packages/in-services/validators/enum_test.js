/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { buildEnumValidator } from 'in-services/validators/enum';

describe('in-services/validators/enum', () => {
  describe('buildEnumValidator', () => {
    let allowedValues;

    beforeEach(() => {
      allowedValues = ['a', 'b', 'c'];
    });

    it('must not report error on undefined', () => {
      expect(buildEnumValidator(allowedValues)(undefined)).to.equal(undefined);
    });

    it('must report error on unknown values', () => {
      expect(buildEnumValidator(allowedValues)('C')).to.deep.equal([
        {
          severity: 'error',
          message: `Value 'C' is not one of the supported values. Expected one of: a, b, c`
        }
      ]);
    });

    it('must not report error on known value', () => {
      expect(buildEnumValidator(allowedValues)('c')).to.equal(undefined);
    });
  });
});
