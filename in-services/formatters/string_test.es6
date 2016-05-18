/* eslint-env mocha */

import {expect} from 'chai';

import * as formatters from 'in-services/formatters/string';

describe('in-services.formatters.string', () => {
  describe('capitalize', () => {
    it('should return the string with the first letter being uppercase', () => {
      expect(formatters.capitalize('look at me!')).to.equal('Look at me!');
    });

    it('should not fail for falsy values', () => {
      expect(formatters.capitalize(null)).to.equal(null);
      expect(formatters.capitalize(undefined)).to.equal(undefined);
      expect(formatters.capitalize('')).to.equal('');
    });
  });

  describe('parseLong', () => {
    it('should parse large numbers to long like number type', () => {
      expect(formatters.parseLong('2678400000.456')).to.equal(2678400000);
    });
  });
});
