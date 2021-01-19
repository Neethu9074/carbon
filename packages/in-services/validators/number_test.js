/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha, node */
import { expect } from 'chai';

import { positiveNumberValidator } from 'in-services/validators/number';

describe('in-services/valiudators/number', () => {
  describe('positiveNumberValidator', () => {
    it('should return null when given an positive number', () => {
      expect(positiveNumberValidator(1)).to.equal(null);
      expect(positiveNumberValidator('10')).to.equal(null);
    });

    it('should return error message when given empty or non positive numbers', () => {
      expect(positiveNumberValidator(0)).to.deep.equal([
        {
          severity: 'error',
          message: `Please type in a positive number.`
        }
      ]);
      expect(positiveNumberValidator('-1')).to.deep.equal([
        {
          severity: 'error',
          message: `Please type in a positive number.`
        }
      ]);
      expect(positiveNumberValidator('')).to.deep.equal([
        {
          severity: 'error',
          message: `Please type in a positive number.`
        }
      ]);
      expect(positiveNumberValidator(null)).to.deep.equal([
        {
          severity: 'error',
          message: `Please type in a positive number.`
        }
      ]);
    });
  });
});
