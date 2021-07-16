/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env jest, node */
import { expect } from 'chai';

import { dateValidator } from 'in-services/validators/date';
import { dateFormat } from 'in-services/formatters/date';

describe('in-services/valiudators/date', () => {
  describe('dateValidator', () => {
    it('should return null when given an empty string or correct date', () => {
      expect(dateValidator('', dateFormat, true)).to.equal(null);
      expect(dateValidator('2019-01-30', dateFormat, true)).to.equal(null);
    });

    it('should return error message when given an invalid date', () => {
      expect(dateValidator('2019-01-32', dateFormat, true)).to.deep.equal([
        {
          severity: 'error',
          message: `Date is invalid`
        }
      ]);
      expect(dateValidator('abcd-ef-gh', dateFormat, true)).to.deep.equal([
        {
          severity: 'error',
          message: `Date is invalid`
        }
      ]);
    });

    it('should return error message when give invalid date format', () => {
      expect(dateValidator('2019-01-3221', dateFormat, true)).to.deep.equal([
        {
          severity: 'error',
          message: `Date does not have the format ${dateFormat}`
        }
      ]);
      expect(dateValidator('2019-01-3', dateFormat, true)).to.deep.equal([
        {
          severity: 'error',
          message: `Date does not have the format ${dateFormat}`
        }
      ]);
    });
  });
});
