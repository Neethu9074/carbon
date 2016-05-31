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

  describe('hashCode', () => {
    it('should generate a hash code for a string', () => {
      expect(formatters.hashCode('foobar')).to.equal(-1268878963);
    });

    it('should generate the same hash code multiple times', () => {
      expect(formatters.hashCode('foobar')).to.equal(formatters.hashCode('foobar'));
    });

    it('should generate a hash code for an empty string', () => {
      expect(formatters.hashCode('')).to.equal(0);
    });

    it('should not fail for undefined and null', () => {
      expect(formatters.hashCode(undefined)).to.equal(0);
      expect(formatters.hashCode(null)).to.equal(0);
    });
  });
});
