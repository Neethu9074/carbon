/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */
import { expect } from 'chai';

import { dateValidator } from 'in-services/validators/date';
import { dateFormat } from 'in-services/formatters/date';

describe('in-services/validators/date', () => {
  describe('dateValidator', () => {
    it('should return null when given an empty string or correct date', () => {
      expect(dateValidator('')).to.equal(null);
      expect(dateValidator('2019-01-30')).to.equal(null);
      expect(dateValidator('2019-01-3')).to.deep.equal(null);
    });

    it('should return error message when given an invalid date', () => {
      expect(dateValidator('2019-01-32')).to.deep.equal([
        {
          severity: 'error',
          message: `Date is invalid`
        }
      ]);
      expect(dateValidator('abcd-ef-gh')).to.deep.equal([
        {
          severity: 'error',
          message: `Date is invalid`
        }
      ]);
    });

    it('should return error message when give invalid date format', () => {
      expect(dateValidator('2019-01-3221')).to.deep.equal([
        {
          severity: 'error',
          message: `Date does not have the format ${dateFormat}`
        }
      ]);
    });
  });
});
