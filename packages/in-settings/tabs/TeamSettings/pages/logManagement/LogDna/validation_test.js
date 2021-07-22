/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { validLogDnaId } from 'in-settings/tabs/TeamSettings/pages/logManagement/LogDna/validation';

describe('in-settings/tabs/TeamSettings/pages/logManagement/LogDna/validation', () => {
  describe('validLogDnaId', () => {
    it('should return null when given an empty string or correct account id', () => {
      expect(validLogDnaId('')).to.equal(null);
      expect(validLogDnaId('jfd83hg9')).to.equal(null);
      expect(validLogDnaId('83rhis-fjef873r-ejfiefr9')).to.equal(null);
    });

    it('should return error message when given an invalid account id', () => {
      expect(validLogDnaId('38hf83*')).to.deep.equal([
        {
          severity: 'error',
          message: 'The Account/Dashboard ID must only contain letters, numbers and -.'
        }
      ]);
      expect(validLogDnaId('83rhis-fjef87#3r-ejfiefr9')).to.deep.equal([
        {
          severity: 'error',
          message: 'The Account/Dashboard ID must only contain letters, numbers and -.'
        }
      ]);
    });
  });
});
