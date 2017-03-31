/* eslint-env mocha */

import { expect } from 'chai';

import { isBlank } from 'in-services/util/string';

describe('in-services/util/string', () => {
  describe('isBlank', () => {
    it('must declare null as blank', () => {
      expect(isBlank(null)).to.equal(true);
    });

    it('must declare undefined as blank', () => {
      expect(isBlank(undefined)).to.equal(true);
    });

    it('must declare empty string as blank', () => {
      expect(isBlank('')).to.equal(true);
    });

    it('must declare string with only whitespace as blank', () => {
      expect(isBlank('   \n  \t')).to.equal(true);
    });

    it('must declare strings with content as not blank', () => {
      expect(isBlank('a fart')).to.equal(false);
    });
  });
});
