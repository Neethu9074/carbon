/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env mocha, node */
import { expect } from 'chai';

import { validMezmoId } from 'in-settings/tabs/GlobalSettings/pages/integrations/logging/Mezmo/validation';

describe('in-settings/tabs/GlobalSettings/pages/logManagement/Mezmo/validation', () => {
  describe('validMezmoId', () => {
    it('should return null when given a correct account id', () => {
      expect(validMezmoId('jfd83hg9')).to.equal(null);
      expect(validMezmoId('83rhis-fjef873r-ejfiefr9')).to.equal(null);
    });

    it('should return error message when given an invalid account id', () => {
      expect(validMezmoId('')).to.deep.equal([
        {
          severity: 'error',
          message: 'The Account/Dashboard ID must only contain letters, numbers and -.'
        }
      ]);
      expect(validMezmoId('38hf83*')).to.deep.equal([
        {
          severity: 'error',
          message: 'The Account/Dashboard ID must only contain letters, numbers and -.'
        }
      ]);
      expect(validMezmoId('83rhis-fjef87#3r-ejfiefr9')).to.deep.equal([
        {
          severity: 'error',
          message: 'The Account/Dashboard ID must only contain letters, numbers and -.'
        }
      ]);
    });
  });
});
